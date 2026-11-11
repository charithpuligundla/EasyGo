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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4 py-16 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">EasyGo VIP</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Reset Password</h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/15 border border-red-500/30 text-red-300 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-5 text-emerald-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instructions Sent
              </div>
              <p className="font-medium text-slate-300">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <p className="text-[11px] text-emerald-400 mt-2 font-semibold">
                (For demo testing, accounts use the password <span className="font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded">password123</span>.)
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full py-3.5 text-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
