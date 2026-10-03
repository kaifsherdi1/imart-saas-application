'use client';

import React, { useState, useCallback } from 'react';
import { API_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Store, MapPin, Briefcase, Camera, ShieldCheck, Upload, Map, Eye, EyeOff } from 'lucide-react';

export default function RegisterStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    business_type: '',
    license_type: '',
    password: '',
    password_confirmation: '',
    consent: false,
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    business_proof: null,
    shop_front_photo: null,
    shop_interior_photo: null,
    owner_id_proof: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          Swal.fire({
            icon: 'success',
            title: 'Location Captured',
            text: 'Your shop GPS coordinates have been saved.',
            background: '#111217',
            color: '#fff',
            confirmButtonColor: '#3B82F6',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Location Error',
            text: 'Could not fetch location. Please enable GPS permissions.',
            background: '#111217',
            color: '#fff',
            confirmButtonColor: '#EF4444',
          });
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match.', background: '#111217', color: '#fff' });
      return;
    }
    if (!formData.consent) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'You must provide consent.', background: '#111217', color: '#fff' });
      return;
    }

    setLoading(true);
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value.toString());
    });
    Object.entries(files).forEach(([key, file]) => {
      if (file) formPayload.append(key, file);
    });

    try {
      const response = await fetch(`${API_URL}/register-owner`, {
        method: 'POST',
        body: formPayload,
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your store application is pending admin approval.',
          background: '#111217',
          color: '#fff',
          confirmButtonColor: '#3B82F6',
        });
        router.push('/login');
      } else {
        throw new Error(result.message || 'Registration failed. Please check the fields.');
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: err.message,
        background: '#111217',
        color: '#fff',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 relative mt-8">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      {/* <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-50 bg-black/50 p-2 rounded-full backdrop-blur-md mt-16">
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back
      </Link> */}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Partner with iMart</h1>
          <p className="text-slate-400 text-lg">Register your store and start selling to thousands of customers instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

          {/* Section 1: Basic Information */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-card/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-xl text-primary"><Store size={24} /></div>
              <h2 className="text-2xl font-bold text-white">1. Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Store / Shop Name *</label>
                <input type="text" name="shop_name" required value={formData.shop_name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-colors" placeholder="e.g. Pune Electronics" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First Name *</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name *</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number *</label>
                <div className="flex gap-2">
                  <input type="tel" name="mobile" required value={formData.mobile} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-colors" />
                  <button type="button" className="px-6 rounded-2xl bg-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-colors whitespace-nowrap">Verify</button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Shop Details */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-card/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><MapPin size={24} /></div>
              <h2 className="text-2xl font-bold text-white">2. Shop Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-400 focus:outline-none transition-colors" placeholder="Bldg / Street / Area" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City *</label>
                <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-400 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State *</label>
                <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-400 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pincode *</label>
                <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-400 focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-col justify-end">
                <button type="button" onClick={captureLocation} className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                  <Map size={20} /> Capture Live Location
                </button>
                {formData.latitude && <p className="text-green-400 text-xs mt-2 text-center">✓ Location Captured</p>}
              </div>
            </div>
          </motion.div>

          {/* Section 3: Business Information */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-card/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400"><Briefcase size={24} /></div>
              <h2 className="text-2xl font-bold text-white">3. Business Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Type *</label>
                <select name="business_type" required value={formData.business_type} onChange={handleInputChange} className="w-full bg-[#1A1C23] border border-white/10 rounded-2xl p-4 text-white focus:border-amber-400 focus:outline-none transition-colors">
                  <option value="">Select Type</option>
                  <option value="Kirana Store">Kirana Store</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">License Type *</label>
                <select name="license_type" required value={formData.license_type} onChange={handleInputChange} className="w-full bg-[#1A1C23] border border-white/10 rounded-2xl p-4 text-white focus:border-amber-400 focus:outline-none transition-colors">
                  <option value="">Select License</option>
                  <option value="Shop License">Shop License</option>
                  <option value="Trade License">Trade License</option>
                  <option value="GST">GST</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upload Business Proof *</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-amber-400/50 transition-colors relative">
                  <input type="file" name="business_proof" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" />
                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                  <p className="text-slate-400 text-sm">{files.business_proof ? files.business_proof.name : 'Click or drag file to upload (PDF, JPG)'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Verification Section */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="bg-card/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Camera size={24} /></div>
              <h2 className="text-2xl font-bold text-white">4. Verification Photos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shop Front Photo *</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-emerald-400/50 transition-colors relative h-32 flex flex-col items-center justify-center">
                  <input type="file" name="shop_front_photo" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                  <Camera className="text-slate-400 mb-2" size={24} />
                  <p className="text-slate-400 text-xs">{files.shop_front_photo ? files.shop_front_photo.name : 'Upload Photo'}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shop Interior Photo *</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-emerald-400/50 transition-colors relative h-32 flex flex-col items-center justify-center">
                  <input type="file" name="shop_interior_photo" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                  <Camera className="text-slate-400 mb-2" size={24} />
                  <p className="text-slate-400 text-xs">{files.shop_interior_photo ? files.shop_interior_photo.name : 'Upload Photo'}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Owner ID Proof (Aadhaar/PAN) *</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-emerald-400/50 transition-colors relative h-32 flex flex-col items-center justify-center">
                  <input type="file" name="owner_id_proof" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,image/*" />
                  <Upload className="text-slate-400 mb-2" size={24} />
                  <p className="text-slate-400 text-xs">{files.owner_id_proof ? files.owner_id_proof.name : 'Upload Document'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 5: Security & Consent */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="bg-card/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400"><ShieldCheck size={24} /></div>
              <h2 className="text-2xl font-bold text-white">5. Security & Consent</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" required minLength={8} value={formData.password} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white focus:border-rose-400 focus:outline-none transition-colors" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" required minLength={8} value={formData.password_confirmation} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white focus:border-rose-400 focus:outline-none transition-colors" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <input type="checkbox" name="consent" id="consent" required checked={formData.consent} onChange={handleInputChange} className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background" />
              <label htmlFor="consent" className="text-sm text-slate-300 leading-relaxed cursor-pointer">
                I confirm that the provided information is accurate and my business is genuine. I agree to the platform's terms of service and privacy policy.
              </label>
            </div>
          </motion.div>

          {/* Submit */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto md:min-w-[300px] mx-auto block rounded-2xl bg-primary py-5 px-8 text-xl font-black text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting Application...' : 'Submit Store Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
