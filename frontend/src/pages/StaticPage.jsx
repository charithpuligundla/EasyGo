import { Link, useParams } from 'react-router-dom';
import { sitePages } from '../content/sitePages';

const StaticPage = ({ slug: slugProp }) => {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;
  const page = sitePages[slug];

  if (!page) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
        <Link to="/" className="text-primary-500 font-semibold mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="glass-card p-8 md:p-12 rounded-3xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{page.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">{page.subtitle}</p>
          <div className="space-y-8">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{section.heading}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{section.body}</p>
              </section>
            ))}
          </div>
          {slug === 'help' && (
            <Link to="/contact" className="inline-block mt-10 text-primary-500 font-semibold hover:underline">
              Contact support →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
