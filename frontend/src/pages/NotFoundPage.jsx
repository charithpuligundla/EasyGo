import { Link } from 'react-router-dom';
import { ArrowLeft, Car, Search, Sparkles } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 text-white px-4 py-24 selection:bg-emerald-500 selection:text-white">
    <div className="max-w-lg text-center bg-slate-900 border border-white/10 p-10 rounded-3xl shadow-2xl">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <Car className="h-10 w-10" />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-emerald-400">404 • Destination Unknown</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-black text-white">This Road Ends Here</h1>
      <p className="mt-3 text-xs md:text-sm text-slate-400">
        The route you are searching for does not exist or has been relocated to another garage.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-xs font-bold text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Home
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 transition-all"
        >
          <Search className="h-4 w-4" /> Browse Exotic Fleet
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
