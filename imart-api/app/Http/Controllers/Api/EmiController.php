<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmiApplication;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmiController extends Controller
{
    /**
     * Submit an EMI application.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'requested_amount' => 'required|numeric|min:1000|max:10000000',
            'applicant_aadhaar' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'family_aadhaar' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'applicant_bank_details' => 'required|string|max:2000',
            'family_bank_details' => 'required|string|max:2000',
            'accepted_legal_terms' => 'accepted',
        ]);

        $user = $request->user();

        // Check if pending application exists
        if (EmiApplication::where('user_id', $user->id)->where('status', 'pending')->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You already have a pending EMI application.'
            ], 400);
        }

        // Identity documents are stored on the private disk, never publicly.
        $applicantAadhaarPath = $request->file('applicant_aadhaar')->store('emi_docs', 'local');
        $familyAadhaarPath = $request->file('family_aadhaar')->store('emi_docs', 'local');

        $application = EmiApplication::create([
            'user_id' => $user->id,
            'requested_amount' => $request->requested_amount,
            'applicant_aadhaar_url' => $applicantAadhaarPath,
            'family_aadhaar_url' => $familyAadhaarPath,
            'applicant_bank_details' => $request->applicant_bank_details,
            'family_bank_details' => $request->family_bank_details,
            'accepted_legal_terms' => true,
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'EMI application submitted successfully. Pending admin approval.',
            'data' => $application->only(['id', 'requested_amount', 'status', 'created_at'])
        ], 201);
    }

    /**
     * Admin: Approve EMI application
     */
    public function approve(string $id): JsonResponse
    {
        $approved = DB::transaction(function () use ($id) {
            // Lock the row so two concurrent approvals cannot credit the wallet twice.
            $application = EmiApplication::lockForUpdate()->findOrFail($id);

            if ($application->status !== 'pending') {
                return false;
            }

            $application->update(['status' => 'approved']);
            User::whereKey($application->user_id)->increment('wallet_balance', $application->requested_amount);

            return true;
        });

        if (!$approved) {
            return response()->json(['status' => 'error', 'message' => 'Application is not pending.'], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'EMI application approved. Amount credited to user wallet.'
        ]);
    }

    /**
     * Get user's wallet balance
     */
    public function walletBalance(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'wallet_balance' => $request->user()->wallet_balance
        ]);
    }
}
