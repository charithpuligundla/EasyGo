import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Car, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md border-b border-gray-200 py-3' : 'bg-white/95 backdrop-blur-sm shadow-sm py-4'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary-500 rounded-xl group-hover:scale-105 transition-transform">
            <Car className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            EasyGo
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/search" className="font-medium text-gray-700 hover:text-primary-600 transition-colors">Rent a Vehicle</Link>
          <Link to={user ? "/list" : "/login"} className="font-medium text-gray-700 hover:text-primary-600 transition-colors">List Your Vehicle</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="font-medium text-gray-700 hover:text-primary-600 transition-colors">Admin</Link>
          )}

          <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="font-medium text-gray-900 flex items-center gap-2 hover:text-primary-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  {user.firstName}
                </Link>
                <button onClick={onLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Log out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-sm font-medium">
                <User className="w-4 h-4" />
                <span>Log in</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg p-4 flex flex-col space-y-2">
          <Link to="/search" onClick={() => setIsOpen(false)} className="font-medium text-gray-800 p-3 hover:bg-gray-100 rounded-xl">Rent a Vehicle</Link>
          <Link to={user ? "/list" : "/login"} onClick={() => setIsOpen(false)} className="font-medium text-gray-800 p-3 hover:bg-gray-100 rounded-xl">List Your Vehicle</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="font-medium text-gray-800 p-3 hover:bg-gray-100 rounded-xl">Admin</Link>
          )}
          <hr className="border-gray-200 my-1" />

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="font-medium text-center w-full py-3 rounded-xl bg-gray-100 text-gray-900">
                My Dashboard
              </Link>
              <button onClick={onLogout} className="font-medium text-center w-full py-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="font-medium text-center w-full py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700">
              Log In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
