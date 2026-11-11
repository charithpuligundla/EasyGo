import { Link } from 'react-router-dom';
import { ArrowLeft, Car, Search } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-20">
    <div className="max-w-lg text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
        <Car className="h-10 w-10" />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-500">404 error</p>
      <h1 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">This road ends here.</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">The page you are looking for has moved or does not exist.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-bold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Link to="/search" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-900 hover:bg-white dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
          <Search className="h-4 w-4" /> Browse vehicles
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
