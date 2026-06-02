'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, Shield, TrendingUp, Cpu, Headset, CheckCircle2, 
  Sparkles, Clock, Lock, Server, Activity, Terminal, ArrowUpRight, Check, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const reasons = [
  { 
    title: "Lightning Fast", 
    desc: "Experience sub-second load times with our optimized multi-tenant infrastructure.", 
    icon: Zap,
    color: "from-amber-400 to-orange-500"
  },
  { 
    title: "Bank-Grade Security", 
    desc: "All transactions are protected by industry-standard encryption and security protocols.", 
    icon: Shield,
    color: "from-blue-400 to-indigo-500"
  },
  { 
    title: "Real-time Analytics", 
    desc: "Monitor your business performance as it happens with live dashboards.", 
    icon: TrendingUp,
    color: "from-emerald-400 to-teal-500"
  },
  { 
    title: "AI-Powered Insights", 
    desc: "Get smart recommendations to optimize your inventory and boost sales.", 
    icon: Cpu,
    color: "from-purple-400 to-pink-500"
  },
  { 
    title: "24/7 Expert Support", 
    desc: "Our dedicated support team is online round-the-clock to scale your business.", 
    icon: Headset,
    color: "from-rose-400 to-red-500"
  },
  { 
    title: "Seamless Integration", 
    desc: "Connect with your favorite tools and payment gateways in minutes.", 
    icon: CheckCircle2,
    color: "from-sky-400 to-blue-500"
  },
];

export default function WhyChooseUs() {
  const [activeReason, setActiveReason] = useState(0);

  // Auto-rotate feature showcase if user is idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReason((prev) => (prev + 1) % reasons.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-48 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          {/* Left: Text & Features List */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">The iMart Advantage</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tight text-black leading-[0.95] uppercase">
                Why thousands <br /> of <span className="text-gray-400">sellers trust us.</span>
              </h3>
              <p className="text-lg text-gray-500 max-w-xl font-medium leading-relaxed">
                We provide the most robust and flexible marketplace solution on the market. 
                Our platform is built by developers, for creators.
              </p>
            </div>

            {/* Grid of Interactive Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {reasons.map((reason, i) => {
                const isActive = activeReason === i;
                return (
                  <div 
                    key={i} 
                    onMouseEnter={() => setActiveReason(i)}
                    className={`reason-item cursor-pointer p-6 rounded-[28px] border transition-all duration-500 flex flex-col justify-between h-56 ${
                      isActive 
                        ? 'bg-white border-primary/20 shadow-xl shadow-primary/5 translate-y-[-4px]' 
                        : 'bg-transparent border-transparent hover:bg-white/50 hover:border-black/5 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className={`h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br ${reason.color} text-white shadow-lg transition-transform duration-500 ${isActive ? 'scale-110' : ''}`}>
                        <reason.icon size={22} />
                      </div>
                      <h4 className="font-black text-black mt-6 mb-2 uppercase tracking-tight text-lg">{reason.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">{reason.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Interactive Console Display */}
          <div className="lg:col-span-6 relative w-full h-[600px] flex items-center justify-center">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl opacity-20 animate-pulse" />
            
            {/* The Outer Main Console Shell */}
            <div className="relative w-full h-full max-w-[580px] max-h-[550px] rounded-[40px] border border-black/10 bg-slate-950 p-10 shadow-2xl overflow-hidden flex flex-col justify-between text-white">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2">
                    <Activity size={10} className="text-primary animate-pulse" />
                    imart_console_v2.0
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                  LIVE FEED
                </span>
              </div>

              {/* Central Dynamic Screen Content with AnimatePresence */}
              <div className="flex-1 py-8 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  
                  {/* WIDGET 1: Lightning Fast */}
                  {activeReason === 0 && (
                    <motion.div 
                      key="speed"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Zap size={18} />
                          <span className="text-sm font-black uppercase tracking-wider">Performance Monitor</span>
                        </div>
                        <p className="text-xs text-slate-400">Edge network content-delivery cache loading speed statistics.</p>
                      </div>

                      {/* Giant Speed Gauge */}
                      <div className="grid grid-cols-2 gap-4 my-auto">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Core Load Time</span>
                          <span className="text-5xl font-black text-amber-400 mt-2 tracking-tighter">0.02s</span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                            <Check size={10} /> 99% faster
                          </span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Edge Latency</span>
                          <span className="text-5xl font-black text-white mt-2 tracking-tighter">12ms</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Global Avg</span>
                        </div>
                      </div>

                      {/* Mock Terminal Output */}
                      <div className="rounded-xl bg-black p-4 border border-white/5 font-mono text-[10px] text-emerald-400/90 space-y-1">
                        <p className="text-slate-500">$ curl -I https://imart.saas/api/v2</p>
                        <p>HTTP/2 200 OK | x-cache: HIT-EDGE-MUMBAI</p>
                        <p>time_total: 0.021s | server: cloudflare-enterprise</p>
                      </div>
                    </motion.div>
                  )}

                  {/* WIDGET 2: Bank-Grade Security */}
                  {activeReason === 1 && (
                    <motion.div 
                      key="security"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Shield size={18} />
                          <span className="text-sm font-black uppercase tracking-wider">Security Protocol status</span>
                        </div>
                        <p className="text-xs text-slate-400">Cryptographic isolation levels, SSL states and fraud protection systems.</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 my-auto">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                          <Lock size={16} className="text-blue-400 mx-auto mb-2" />
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">AES-256</span>
                          <span className="text-xs font-bold text-white">Encrypted</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                          <Server size={16} className="text-emerald-400 mx-auto mb-2" />
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">SSL SHA2</span>
                          <span className="text-xs font-bold text-emerald-400">Verified</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                          <Shield size={16} className="text-purple-400 mx-auto mb-2" />
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">PCI-DSS</span>
                          <span className="text-xs font-bold text-white">Level 1</span>
                        </div>
                      </div>

                      {/* Active Security Activity Logs */}
                      <div className="rounded-xl bg-black p-4 border border-white/5 font-mono text-[9px] text-slate-400 space-y-1">
                        <p className="text-emerald-400">[SECURE] TLS handshake completed successfully with merchant API endpoint.</p>
                        <p className="text-blue-400">[SHIELD] Anti-fraud rate limiter status: 0 flagged events.</p>
                        <p className="text-slate-500">[SYSTEM] All systems nominal. Database sandbox fully isolated.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* WIDGET 3: Real-time Analytics */}
                  {activeReason === 2 && (
                    <motion.div 
                      key="analytics"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <TrendingUp size={18} />
                          <span className="text-sm font-black uppercase tracking-wider">Live Revenue Stream</span>
                        </div>
                        <p className="text-xs text-slate-400">SaaS transactional velocity and real-time ledger auditing.</p>
                      </div>

                      {/* Graph/Metric block */}
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 my-auto flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Live Balance</span>
                          <span className="text-4xl font-black text-white tracking-tight mt-1">₹4,89,120</span>
                          <span className="text-xs text-emerald-400 font-bold mt-2 block flex items-center gap-1">
                            +48.2% <ArrowUpRight size={12} /> Today
                          </span>
                        </div>
                        
                        {/* Custom visual bars matching premium design */}
                        <div className="flex items-end gap-2 h-20">
                          <div className="w-2 rounded-full bg-emerald-500/20 h-[30%]" />
                          <div className="w-2 rounded-full bg-emerald-500/40 h-[50%]" />
                          <div className="w-2 rounded-full bg-emerald-500/60 h-[40%]" />
                          <div className="w-2 rounded-full bg-emerald-500/80 h-[80%]" />
                          <div className="w-2 rounded-full bg-primary h-[100%] animate-pulse" />
                        </div>
                      </div>

                      {/* Trans History List */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                          <span className="font-semibold text-slate-300">Aura Gold Boutique</span>
                          <span className="font-mono text-emerald-400 font-bold">+₹1,25,000</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                          <span className="font-semibold text-slate-300">Velvet Apparel Checkout</span>
                          <span className="font-mono text-emerald-400 font-bold">+₹14,500</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* WIDGET 4: AI-Powered Insights */}
                  {activeReason === 3 && (
                    <motion.div 
                      key="ai"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-400">
                          <Cpu size={18} />
                          <span className="text-sm font-black uppercase tracking-wider">iMart AI Neural Engine</span>
                        </div>
                        <p className="text-xs text-slate-400">Real-time deep learning analytics running stock predictions.</p>
                      </div>

                      {/* AI Chat-Box style recommendation */}
                      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 my-auto space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">STOCK VELOCITY ALERT</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">
                          "Electronics items are selling <span className="text-purple-400 font-bold">3.2x faster</span> in Mumbai today. Suggesting restocking <span className="text-white font-bold">Titanium Keyboards</span> immediately to capture peak evening sales lift (+24%)."
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                        <span className="text-slate-400">Confidence Metric</span>
                        <span className="font-mono text-purple-400 font-black">98.4% Accuracy</span>
                      </div>
                    </motion.div>
                  )}

                  {/* WIDGET 5: 24/7 Expert Support */}
                  {activeReason === 4 && (
                    <motion.div 
                      key="support"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-400">
                          <Headset size={18} />
                          <span className="text-sm font-black uppercase tracking-wider">Active Platform Support</span>
                        </div>
                        <p className="text-xs text-slate-400">Direct instant channel connected with our specialized engineers.</p>
                      </div>

                      {/* Chat Bubbles */}
                      <div className="space-y-3 my-auto">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] border border-white/10">
                            ME
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                            <p className="text-[11px] text-slate-300 leading-relaxed">Need help configuring customized domain mappings for multi-tenant stores.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-none p-4 max-w-[80%] text-right">
                            <p className="text-[11px] text-white leading-relaxed">I have updated your custom DNS. The CNAME redirection is now fully active worldwide!</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-white relative">
                            IM
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-slate-950" />
                          </div>
                        </div>
                      </div>

                      {/* Response Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Avg Response</span>
                          <span className="text-sm font-bold text-rose-400">&lt; 3 mins</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">CSAT Rating</span>
                          <span className="text-sm font-bold text-white">4.98 / 5.00</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* WIDGET 6: Seamless Integration */}
                  {activeReason === 5 && (
                    <motion.div 
                      key="integration"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sky-400">
                          <Network size={18} />
                          <span className="text-sm font-black uppercase tracking-wider">Omnichannel Sync Engine</span>
                        </div>
                        <p className="text-xs text-slate-400">Direct SDK nodes interfacing with primary fintech & supply gateways.</p>
                      </div>

                      {/* Diagram representation */}
                      <div className="flex justify-center items-center gap-4 my-auto relative">
                        <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-center h-14 w-14 font-mono text-[10px]">
                          Stripe
                        </div>
                        <div className="h-[2px] w-8 bg-sky-500/50 animate-pulse" />
                        <div className="bg-primary p-4 rounded-3xl flex items-center justify-center h-16 w-16 font-black text-white shadow-xl shadow-primary/20 animate-bounce" style={{ animationDuration: '4s' }}>
                          iMart
                        </div>
                        <div className="h-[2px] w-8 bg-sky-500/50 animate-pulse" />
                        <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-center h-14 w-14 font-mono text-[10px]">
                          FedEx
                        </div>
                      </div>

                      {/* Code Block mapping integration */}
                      <div className="rounded-xl bg-black p-4 border border-white/5 font-mono text-[9px] text-slate-400 space-y-1">
                        <p className="text-sky-400">import {"{ iMartEngine }"} from '@imart-saas/core';</p>
                        <p className="text-slate-300">const sync = iMartEngine.connectGateway('stripe');</p>
                        <p className="text-emerald-400">sync.status() // connected (latency: 8ms)</p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Console Footer */}
              <div className="border-t border-white/5 pt-6 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>SYSTEM_SANDBOX: SECURE</span>
                <span className="text-emerald-400 animate-pulse">● CONNECTED</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
