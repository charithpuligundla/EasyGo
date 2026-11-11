import { Car, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { footerLinks } from '../content/sitePages';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary-500 rounded-xl">
                <Car className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                EasyGo
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              The premium marketplace for vehicle rentals. Experience the freedom of choice with our vast fleet of verified vehicles.
            </p>
            <div className="flex gap-4">
              <Link to="/sitemap" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors" aria-label="Sitemap">
                <MapPin className="w-5 h-5" />
              </Link>
              <a href="mailto:support@easygo.com" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
              <Link to="/contact" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors" aria-label="Contact">
                <Phone className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Hosting</h4>
            <ul className="space-y-4">
              {footerLinks.hosting.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} EasyGo Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            {footerLinks.legal.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-primary-500 transition-colors">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
