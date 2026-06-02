<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmiApplication;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EmiController extends Controller
{
    /**
     * Submit an EMI application.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'requested_amount' => 'required|numeric|min:1000',
            'applicant_aadhaar' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'family_aadhaar' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'applicant_bank_details' => 'required|string',
            'family_bank_details' => 'required|string',
            'accepted_legal_terms' => 'required|boolean|accepted',
        ]);

        $user = $request->user();

        // Check if pending application exists
        if (EmiApplication::where('user_id', $user->id)->where('status', 'pending')->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You already have a pending EMI application.'
            ], 400);
        }

        $applicantAadhaarUrl = $request->file('applicant_aadhaar')->store('emi_docs', 'public');
        $familyAadhaarUrl = $request->file('family_aadhaar')->store('emi_docs', 'public');

        $application = EmiApplication::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'requested_amount' => $request->requested_amount,
            'applicant_aadhaar_url' => $applicantAadhaarUrl,
            'family_aadhaar_url' => $familyAadhaarUrl,
            'applicant_bank_details' => $request->applicant_bank_details,
            'family_bank_details' => $request->family_bank_details,
            'accepted_legal_terms' => $request->accepted_legal_terms,
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'EMI application submitted successfully. Pending admin approval.',
            'data' => $application
        ], 201);
    }

    /**
     * Admin: Approve EMI application
     */
    public function approve(Request $request, $id): JsonResponse
    {
        $application = EmiApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json(['status' => 'error', 'message' => 'Application is not pending.'], 400);
        }

        $application->update(['status' => 'approved']);

        // Credit to user's wallet
        $user = $application->user;
        $user->increment('wallet_balance', $application->requested_amount);

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
