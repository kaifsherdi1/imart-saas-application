'use client';

import React, { useState } from 'react';
import { useApplyEmiMutation, useFetchWalletBalanceQuery } from '@/services/productsApi';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { ShieldCheck, UploadCloud, AlertTriangle, FileText, Banknote } from 'lucide-react';

export default function EmiApplicationPage() {
  const { data: walletData, isLoading: walletLoading, refetch } = useFetchWalletBalanceQuery();
  const [applyEmi, { isLoading }] = useApplyEmiMutation();

  const [formData, setFormData] = useState({
    requested_amount: '',
    applicant_bank_details: '',
    family_bank_details: '',
  });

  const [applicantAadhaar, setApplicantAadhaar] = useState<File | null>(null);
  const [familyAadhaar, setFamilyAadhaar] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantAadhaar || !familyAadhaar) {
      Swal.fire({ icon: 'error', title: 'Missing Documents', text: 'Please upload both Aadhaar cards.', background: '#0f172a', color: '#fff' });
      return;
    }

    if (!acceptedTerms) {
      Swal.fire({ icon: 'error', title: 'Terms Not Accepted', text: 'You must accept the legal terms to proceed.', background: '#0f172a', color: '#fff' });
      return;
    }

    const payload = new FormData();
    payload.append('requested_amount', formData.requested_amount);
    payload.append('applicant_bank_details', formData.applicant_bank_details);
    payload.append('family_bank_details', formData.family_bank_details);
    payload.append('applicant_aadhaar', applicantAadhaar);
    payload.append('family_aadhaar', familyAadhaar);
    payload.append('accepted_legal_terms', '1');

    try {
      await applyEmi(payload).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your EMI request is pending admin approval.',
        background: '#0f172a',
        color: '#fff',
      });
      // Clear form
      setFormData({ requested_amount: '', applicant_bank_details: '', family_bank_details: '' });
      setApplicantAadhaar(null);
      setFamilyAadhaar(null);
      setAcceptedTerms(false);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.data?.message || 'Failed to submit EMI application.',
        background: '#0f172a',
        color: '#fff',
      });
    }
  };

  const walletBalance = walletData?.wallet_balance || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Wallet Balance Card */}
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 shadow-[0_0_40px_-15px_rgba(245,158,11,0.3)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-amber-500 flex items-center gap-3"><Banknote size={28} /> iMart EMI Wallet</h2>
              <p className="text-slate-300 mt-2 max-w-2xl">Your approved EMI limits are credited here. You can use this balance during checkout.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Available Limit</p>
              {walletLoading ? (
                <div className="h-10 w-32 bg-slate-800 animate-pulse rounded mt-2 inline-block"></div>
              ) : (
                <p className="text-4xl font-black text-white mt-1">₹{Number(walletBalance).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight">Apply for iMart EMI</h1>
            <p className="text-slate-400 mt-2">Get up to ₹5,00,000 instant credit at a flat 5% interest rate.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Requested EMI Amount *</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-500">₹</span>
                <input required type="number" min="1000" name="requested_amount" value={formData.requested_amount} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-4 pl-12 pr-5 text-xl font-bold text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="50000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800 pt-8">
              {/* Applicant Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2"><ShieldCheck /> Applicant Details</h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Applicant Bank Details *</label>
                  <textarea required rows={3} name="applicant_bank_details" value={formData.applicant_bank_details} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-3 px-4 text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none transition-all" placeholder="Bank Name, Account No, IFSC Code" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Applicant Aadhaar Card *</label>
                  <label className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-6 text-slate-400 transition-all hover:border-blue-500 hover:text-blue-500">
                    <UploadCloud size={24} />
                    <span className="font-bold">{applicantAadhaar ? applicantAadhaar.name : 'Upload PDF/Image'}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, setApplicantAadhaar)} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Family Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2"><ShieldCheck /> Family Member Details</h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Family Member Bank Details *</label>
                  <textarea required rows={3} name="family_bank_details" value={formData.family_bank_details} onChange={handleInputChange} className="w-full rounded-2xl border border-white/5 bg-slate-950 py-3 px-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none transition-all" placeholder="Bank Name, Account No, IFSC Code" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Family Member Aadhaar *</label>
                  <label className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-6 text-slate-400 transition-all hover:border-purple-500 hover:text-purple-500">
                    <UploadCloud size={24} />
                    <span className="font-bold">{familyAadhaar ? familyAadhaar.name : 'Upload PDF/Image'}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, setFamilyAadhaar)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Legal Terms */}
            <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-6 mt-8">
              <h3 className="text-red-500 font-bold flex items-center gap-2 mb-4"><AlertTriangle size={20} /> Legal Terms & Conditions</h3>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 mb-6">
                <li>The EMI amount will be auto-debited from your provided bank account every month.</li>
                <li>A flat interest rate of 5% is applicable on the utilized wallet balance.</li>
                <li>In case of a bounced payment or insufficient funds, a penalty fee of ₹500 plus 2% additional interest will be charged.</li>
                <li>If consecutive payments are missed, iMart reserves the right to automatically deduct the amount from the registered Family Member's bank account.</li>
                <li>If both accounts fail to clear the dues within 60 days, a formal Legal Notice will be issued directly to your home address.</li>
                <li>You acknowledge that iMart can initiate legal recovery proceedings as per the Negotiable Instruments Act in case of default.</li>
              </ul>

              <label className="flex items-start gap-4 cursor-pointer p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-red-500/50 transition-colors">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 h-5 w-5 accent-red-500 cursor-pointer" />
                <span className="text-sm font-bold text-slate-200">
                  I have read, understood, and legally agree to the terms mentioned above. I authorize iMart to initiate auto-debits and take necessary legal actions upon default.
                </span>
              </label>
            </div>

            <button disabled={isLoading} type="submit" className="w-full flex justify-center items-center gap-2 rounded-2xl bg-blue-600 py-5 text-xl font-black text-white hover:bg-blue-700 transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] disabled:opacity-50">
              <FileText />
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">Applications are typically processed within 24-48 hours by our admin team.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
