import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, User as UserIcon, AlertCircle, X, CheckCircle2 } from 'lucide-react';
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
    // Navigate on successful login or register
    if (isSuccess && user) {
      navigate('/dashboard');
      dispatch(reset());
    }
  }, [user, isSuccess, navigate, dispatch]);

  // Clean up error state when switching modes or unmounting
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
      errs.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (!isLogin && password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!isLogin) {
      if (!firstName.trim()) {
        errs.firstName = 'First name is required';
      }
      if (!lastName.trim()) {
        errs.lastName = 'Last name is required';
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (isError) {
      dispatch(clearError());
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (isLogin) {
      dispatch(login({ email: email.trim(), password }));
    } else {
      dispatch(register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      }));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-green-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 sm:p-8 relative z-10 bg-white border border-gray-200 rounded-3xl shadow-xl"
      >
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2.5 bg-primary-600 rounded-2xl shadow-sm">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">EasyGo</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-gray-600 font-medium text-sm mt-1">
            {isLogin ? 'Sign in to access your bookings and fleet.' : 'Join EasyGo to rent or list vehicles.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => toggleMode(true)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => toggleMode(false)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence>
          {isError && message && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-red-50 border-2 border-red-300 text-red-900 p-4 rounded-2xl flex items-start gap-3 shadow-sm"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm text-red-900">
                  {isLogin ? 'Sign In Failed' : 'Registration Failed'}
                </p>
                <p className="text-sm font-medium text-red-800 mt-0.5">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(clearError())}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          {/* First & Last Name fields – register only */}
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    placeholder="John"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white text-gray-900 font-semibold placeholder-gray-400 outline-none transition-all ${
                      fieldErrors.firstName
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                </div>
                {fieldErrors.firstName && (
                  <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={onChange}
                  placeholder="Doe"
                  className={`block w-full px-3.5 py-3 border rounded-xl bg-white text-gray-900 font-semibold placeholder-gray-400 outline-none transition-all ${
                    fieldErrors.lastName
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                  }`}
                />
                {fieldErrors.lastName && (
                  <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="name@example.com"
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white text-gray-900 font-semibold placeholder-gray-400 outline-none transition-all ${
                  fieldErrors.email
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Password <span className="text-red-500">*</span>
              </label>
              {isLogin && (
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={onChange}
                placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-white text-gray-900 font-semibold placeholder-gray-400 outline-none transition-all ${
                  fieldErrors.password
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex justify-center items-center py-3.5 px-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {isLogin ? 'Signing In…' : 'Creating Account…'}
              </span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-6 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
          <p className="font-bold text-gray-800 mb-1">Demo Accounts:</p>
          <p>• Admin / Host: <strong className="text-gray-900">owner@eco-fleet.com</strong> / <span className="font-mono text-gray-800">password123</span></p>
          <p>• Customer: <strong className="text-gray-900">customer@easygo.com</strong> / <span className="font-mono text-gray-800">password123</span></p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
