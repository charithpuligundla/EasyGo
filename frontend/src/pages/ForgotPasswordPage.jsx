import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      setError('Please enter your email address.');
      return;
    }

    if (!emailRegex.test(emailTrimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2.5 bg-primary-600 rounded-2xl shadow-sm">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">EasyGo</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 font-medium text-sm mt-1">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-800 p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-green-900 text-sm">
              <div className="flex items-center gap-2 font-bold text-base mb-1 text-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Instructions Sent
              </div>
              <p className="font-medium text-green-800">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <p className="text-xs text-green-700 mt-2 font-semibold">
                (For demo testing, accounts use the password <span className="font-mono font-bold">password123</span>.)
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full py-3 text-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors shadow-sm"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors shadow-md"
            >
              Send Reset Link
            </button>
            <p className="text-center text-sm font-semibold text-gray-600 pt-2">
              Remember your password?{' '}
              <Link to="/login" className="text-primary-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
