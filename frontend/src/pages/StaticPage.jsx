import { Link, useParams } from 'react-router-dom';
import { sitePages } from '../content/sitePages';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

const StaticPage = ({ slug: slugProp }) => {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;
  const page = sitePages[slug];

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 pb-20 text-center">
        <h1 className="text-3xl font-black mb-3">Page Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">The page you requested could not be located.</p>
        <Link to="/" className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs inline-block">
          Return to Garage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-amber-400" /> EasyGo Concierge
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{page.title}</h1>
          <p className="text-sm md:text-base text-slate-400 mt-2 font-normal">{page.subtitle}</p>
        </div>

        <div className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading} className="pb-6 border-b border-white/10 last:border-b-0 last:pb-0">
              <h2 className="text-lg md:text-xl font-black text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {section.heading}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                {section.body}
              </p>
            </section>
          ))}

          {slug === 'help' && (
            <div className="pt-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all">
                <span>Contact 24/7 VIP Concierge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
