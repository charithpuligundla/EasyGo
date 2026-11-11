import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, User as UserIcon, AlertCircle, X, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, reset, clearError } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const { firstName, lastName, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess && user) {
      navigate('/dashboard');
      dispatch(reset());
    }
  }, [user, isSuccess, navigate, dispatch]);

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setFieldErrors({});
    dispatch(clearError());
  };

  const validate = () => {
    const errs = {};
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (!isLogin && password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!isLogin) {
      if (!firstName.trim()) errs.firstName = 'First name is required';
      if (!lastName.trim()) errs.lastName = 'Last name is required';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (isError) {
      dispatch(clearError());
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setIsLogin(true);
    setFormData((prev) => ({
      ...prev,
      email: demoEmail,
      password: demoPass,
    }));
    dispatch(clearError());
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLogin) {
      dispatch(login({ email: email.trim(), password }));
    } else {
      dispatch(
        register({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row selection:bg-emerald-500 selection:text-white">
      {/* ── Left Visual Cinematic Banner (Desktop) ── */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen overflow-hidden">
        <img
          src="/cars/rimac-nevera.jpg"
          alt="Rimac Nevera Hypercar"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-radial-luxury pointer-events-none" />

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          {/* Top Logo */}
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-500/30">
              <Car className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">EasyGo VIP</span>
          </Link>

          {/* Bottom Luxury Quote & Social Proof */}
          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Rimac Nevera • 1,914 HP Available in SF</span>
            </div>

            <h2 className="text-4xl font-black text-white leading-tight">
              "The finest exotic rental experience on the planet."
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              Join elite drivers and collectors. Unlock direct access to verified hypercars, track specials, and luxury grand tourers with zero paperwork hassle.
            </p>

            <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-2xl font-black text-white">10,000+</span>
                <p className="text-[11px] text-slate-400 font-medium">VIP Trips</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">4.99 ★</span>
                <p className="text-[11px] text-slate-400 font-medium">Client Rating</p>
              </div>
              <div>
                <span className="text-2xl font-black text-white">$50M+</span>
                <p className="text-[11px] text-slate-400 font-medium">Allianz Insured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Container ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        {/* Soft background ambient light */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Mobile Back / Brand */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500">
                <Car className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">EasyGo VIP</span>
            </Link>
            <Link to="/" className="text-xs text-slate-400 hover:text-white">
              Back to Fleet →
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {isLogin ? 'Welcome Back' : 'Create VIP Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isLogin ? 'Enter your credentials to manage bookings & favorites.' : 'Join EasyGo in seconds to rent or host luxury vehicles.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => toggleMode(true)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                isLogin ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => toggleMode(false)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                !isLogin ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {isError && message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/20 border border-red-500/40 text-red-300 p-3.5 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{message}</span>
                </div>
                <button type="button" onClick={() => dispatch(clearError())} className="p-1 text-red-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    placeholder="Alex"
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                  {fieldErrors.firstName && (
                    <p className="text-[11px] text-red-400 mt-1">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    placeholder="Vance"
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                  {fieldErrors.lastName && (
                    <p className="text-[11px] text-red-400 mt-1">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="driver@easygo.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-[11px] text-emerald-400 font-bold hover:underline">
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-semibold outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </span>
              ) : isLogin ? (
                'Sign In to Garage'
              ) : (
                'Join EasyGo Club'
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Quick Demo 1-Click Fill:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('owner@eco-fleet.com', 'password123')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <span className="block text-[11px] font-bold text-emerald-400">Host / Admin</span>
                <span className="text-[10px] text-slate-400">owner@eco-fleet.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('customer@easygo.com', 'password123')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <span className="block text-[11px] font-bold text-white">VIP Renter</span>
                <span className="text-[10px] text-slate-400">customer@easygo.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
