import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Car, User, LogOut, Sparkles, Heart, Compass, ShieldCheck, MessageSquare } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import { useFavorites } from '../api/favoriteApi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: favorites = [] } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-xl py-3 text-white'
          : 'bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-transparent py-5 text-white'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
            <Car className="text-white w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                EasyGo
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                VIP
              </span>
            </div>
            <p className="text-[10px] tracking-wider font-semibold uppercase text-slate-400 hidden sm:block">
              Exotic Cars, Bikes & Watercraft
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          <Link
            to="/search"
            className={`font-semibold text-sm tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/search')
                ? 'text-emerald-400 font-bold'
                : 'text-slate-200 hover:text-white hover:translate-y-[-1px]'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            Explore Fleet
          </Link>

          <Link
            to="/search?type=Supercar"
            className="font-semibold text-sm text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Supercars
          </Link>

          <Link
            to="/search?type=Motorcycles+%26+Superbikes"
            className="font-semibold text-sm text-slate-200 hover:text-white transition-all"
          >
            Bikes & Watercraft
          </Link>

          <Link
            to="/about"
            className="font-semibold text-sm text-slate-200 hover:text-white transition-all"
          >
            How It Works
          </Link>

          <Link
            to={user ? '/list' : '/login'}
            className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all"
          >
            <span>Host a Vehicle</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[10px] text-white font-extrabold">
              Earn $10k+
            </span>
          </Link>
        </div>

        {/* Right CTA / User controls */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <>
              <Link
                to="/messages"
                className={`relative p-2 rounded-xl border transition-colors ${
                  isActive('/messages')
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
                title="Direct Chat Hub"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </Link>
              <Link
                to="/dashboard"
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
                title="Saved Wishlist"
              >
                <Heart className="w-4 h-4 text-emerald-400" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors"
            >
              Admin Portal
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {user.firstName}
                </span>
              </Link>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <User className="w-4 h-4" />
                <span>Join VIP Club</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="lg:hidden p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[70px] bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl p-6 flex flex-col space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link
            to="/search"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-500/10 text-white font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-emerald-400" /> Browse All Fleet
            </span>
            <span className="text-xs text-slate-400">Cars, Bikes, Boats →</span>
          </Link>

          <Link
            to="/search?type=Supercar"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-500/10 text-white font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Supercars & Hypercars
            </span>
          </Link>

          <Link
            to="/search?type=Motorcycles+%26+Superbikes"
            onClick={() => setIsOpen(false)}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-500/10 text-white font-semibold text-sm transition-colors"
          >
            Motorcycles, Jet Skis & Vans
          </Link>

          {user && (
            <Link
              to="/messages"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-sm transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Direct Messages & Host Chat
              </span>
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black">Live</span>
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-500/10 text-white font-semibold text-sm transition-colors"
          >
            How EasyGo Works
          </Link>

          <Link
            to={user ? '/list' : '/login'}
            onClick={() => setIsOpen(false)}
            className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-between"
          >
            <span>Host a Vehicle (Car, Bike, Boat)</span>
            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black">Earn $10k+</span>
          </Link>

          <hr className="border-white/10 my-2" />

          {user ? (
            <div className="space-y-2 pt-1">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-3.5 rounded-2xl bg-white/10 text-white font-bold"
              >
                My Account & Trips
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="block text-center w-full py-3 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/30 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="py-3 rounded-xl bg-white/10 text-center font-bold text-white text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="py-3 rounded-xl bg-emerald-500 text-center font-bold text-white text-sm shadow-lg shadow-emerald-500/30"
              >
                Join VIP Club
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
