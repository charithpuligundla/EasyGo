import { Car, Mail, MapPin, Phone, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { footerLinks } from '../content/sitePages';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/10 pt-16 pb-12 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* VIP Newsletter Strip */}
        <div className="mb-14 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-lg">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" /> EasyGo Black Edition
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Get Private Invitations & New Hypercar Drops
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Be the first to reserve newly acquired V12s, hyper-EVs, and private track days. No spam, strictly automotive passion.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to EasyGo VIP drops!');
            }}
            className="flex w-full md:w-auto gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your VIP email"
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs font-semibold outline-none focus:border-emerald-500 w-full md:w-72"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Join</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-2xl shadow-md shadow-emerald-500/20">
                <Car className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                EasyGo <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest ml-1">Exotics</span>
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier peer-to-peer and verified fleet marketplace for supercars, luxury SUVs, superbikes, jet skis, and sprinter vans. White-glove delivery to Beverly Hills, Miami, Vegas, SF, NYC, and worldwide.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link to="/contact" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 flex items-center justify-center text-slate-300 transition-colors" title="Contact Us">
                <Phone className="w-4 h-4" />
              </Link>
              <a href="mailto:concierge@easygo.com" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 flex items-center justify-center text-slate-300 transition-colors" title="Email VIP Concierge">
                <Mail className="w-4 h-4" />
              </a>
              <Link to="/sitemap" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 flex items-center justify-center text-slate-300 transition-colors" title="Fleet Sitemap">
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {footerLinks.company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">
              Support & Safety
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {footerLinks.support.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Hosting */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">
              Host Your Fleet
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {footerLinks.hosting.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/list" className="text-emerald-400 font-bold hover:underline">
                  List An Exotic Vehicle →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Strip */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} EasyGo Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4">
            {footerLinks.legal.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-slate-300 transition-colors">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
