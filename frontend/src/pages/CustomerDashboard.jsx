import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, CalendarClock, Heart, Wallet, Settings,
  ShieldCheck, Clock, ChevronRight, XCircle, AlertCircle, CheckCircle2,
  MessageSquare, Sparkles, LogOut, ArrowRight, Car
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import { useMyBookings, useUpdateBooking } from '../api/bookingApi';
import { useFavorites } from '../api/favoriteApi';
import { useWalletHistory } from '../api/walletApi';
import { useNotifications, useMarkNotificationRead } from '../api/notificationApi';
import { useSupportTickets, useCreateSupportTicket } from '../api/supportApi';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const tabs = [
  { id: 'bookings', label: 'My Rentals & Requests', icon: <CalendarClock className="w-4 h-4" /> },
  { id: 'profile', label: 'VIP Profile', icon: <User className="w-4 h-4" /> },
  { id: 'wishlist', label: 'Saved Wishlist', icon: <Heart className="w-4 h-4" /> },
  { id: 'wallet', label: 'Spend & Deposit Ledger', icon: <Wallet className="w-4 h-4" /> },
  { id: 'settings', label: 'Support & Concierge', icon: <Settings className="w-4 h-4" /> },
];

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { data: bookings, isLoading, isError } = useMyBookings();
  const { mutate: updateBooking } = useUpdateBooking();
  const { data: favorites = [] } = useFavorites();
  const { data: walletItems = [] } = useWalletHistory();
  const { data: supportTickets = [] } = useSupportTickets();
  const { mutate: createTicket, isPending: isCreatingTicket } = useCreateSupportTicket();
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '' });
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this rental request?')) {
      updateBooking({ id: bookingId, updateData: { status: 'CANCELLED' } });
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess('');
    createTicket(ticketForm, {
      onSuccess: () => {
        setTicketForm({ subject: '', description: '' });
        setTicketSuccess('Support ticket created. VIP Concierge will respond shortly.');
      },
      onError: (err) => {
        setTicketError(err?.response?.data?.message || 'Failed to submit ticket.');
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 text-center flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <p className="text-xl font-bold mb-4">Please log in to view your dashboard.</p>
          <Link to="/login" className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold inline-block shadow-md">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-lg shadow-emerald-500/20">
            {user.firstName?.charAt(0) || 'U'}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 flex items-center justify-center md:justify-start gap-2">
              <span>{user.firstName} {user.lastName}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {user.email} • Account: <strong className="text-emerald-400">{user.role}</strong>
            </p>
            <div className="flex flex-wrap gap-2.5 mt-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-emerald-400 rounded-xl text-xs font-bold">
                {bookings ? bookings.length : 0} Active Bookings
              </span>
              <Link
                to="/messages"
                className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buyer & Owner Chat</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <Link
              to="/list"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-center text-xs shadow-md shadow-emerald-500/25"
            >
              Host / List a Vehicle
            </Link>
            <button
              onClick={onLogout}
              className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-5 py-2.5 rounded-xl font-bold transition-all text-center text-xs"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-3 shadow-xl sticky top-24">
              <nav className="flex flex-col gap-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left font-bold text-xs ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl shadow-xl min-h-[500px]"
              >
                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-xl font-black text-white">Your Vehicle Rentals</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Track status, coordinate delivery, and chat with vehicle hosts.</p>
                      </div>
                      <Link to="/search" className="text-xs font-bold text-emerald-400 hover:underline">
                        + Browse All Vehicles
                      </Link>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-12 text-slate-400 font-semibold text-xs">Loading rental records…</div>
                    ) : isError ? (
                      <div className="text-center text-red-400 py-8 font-semibold text-xs">Failed to load bookings.</div>
                    ) : !bookings || bookings.length === 0 ? (
                      <div className="text-center py-16 text-slate-400">
                        <CalendarClock className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                        <p className="text-base font-bold text-white">You have no active rental requests</p>
                        <p className="text-xs text-slate-400 mt-1 mb-6">Browse supercars, motorcycles, luxury SUVs, and watercraft.</p>
                        <Link to="/search" className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/25 inline-block">
                          Explore Vehicle Marketplace
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border border-white/10 rounded-2xl p-5 bg-slate-950/60 hover:border-emerald-500/40 transition-colors">
                            <div className="flex flex-col md:flex-row gap-5">
                              <img
                                src={booking.vehicle?.images?.[0]?.url ? (booking.vehicle.images[0].url.startsWith('http') || booking.vehicle.images[0].url.startsWith('/cars') ? booking.vehicle.images[0].url : `${apiBase}${booking.vehicle.images[0].url}`) : '/cars/supercar-fleet.jpg'}
                                alt={`${booking.vehicle?.make} ${booking.vehicle?.model}`}
                                className="w-full md:w-52 h-36 object-cover rounded-xl shrink-0 border border-white/10"
                              />
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                    <div>
                                      <h3 className="text-lg font-black text-white">{booking.vehicle?.make} {booking.vehicle?.model}</h3>
                                      <p className="text-[11px] font-mono font-semibold text-slate-400 mt-0.5">Booking Ref: {booking.id.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                      booking.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                      booking.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                      booking.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/10 text-slate-300'
                                    }`}>
                                      {booking.status === 'PENDING' ? 'Awaiting Host Approval' : booking.status}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-300 font-medium">
                                    Rental Dates: <span className="text-white font-bold">{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</span>
                                  </p>
                                </div>

                                <div className="flex flex-wrap justify-between items-end mt-4 pt-4 border-t border-white/10 gap-4">
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total at Handover</p>
                                    <p className="text-xl font-black text-emerald-400">${booking.totalAmount}</p>
                                    <p className="text-[10px] text-slate-400">Includes ${booking.securityDeposit} refundable deposit</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 items-center">
                                    {booking.status === 'PENDING' && (
                                      <button
                                        type="button"
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="px-3.5 py-1.5 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-xl transition-colors"
                                      >
                                        Cancel Request
                                      </button>
                                    )}
                                    <Link
                                      to={`/messages/${booking.id}`}
                                      className="px-4 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl transition-colors flex items-center gap-1.5"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Chat with Host</span>
                                    </Link>
                                    <Link
                                      to={`/vehicles/${booking.vehicleId}`}
                                      className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-colors shadow-sm"
                                    >
                                      View Listing
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── PROFILE TAB ── */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-6">VIP Profile Information</h2>
                    <div className="space-y-4 max-w-lg">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <p className="font-bold text-white text-base">{user.firstName} {user.lastName}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                        <p className="font-bold text-white text-base">{user.email}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Membership Status</label>
                        <p className="font-bold text-emerald-400 text-base">{user.role} Member (Verified Escrow)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── WISHLIST TAB ── */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-6">Saved Wishlist ({favorites.length})</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {favorites.map((v) => (
                        <div key={v.id} className="border border-white/10 rounded-2xl p-4 flex items-center justify-between bg-white/5">
                          <div>
                            <h3 className="font-bold text-white text-sm">{v.make} {v.model}</h3>
                            <p className="text-xs font-bold text-emerald-400">${v.dailyPrice}/day</p>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/vehicles/${v.id}`} className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15">
                              View
                            </Link>
                            <Link to={`/book/${v.id}`} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-400">
                              Book
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    {favorites.length === 0 && <p className="text-slate-400 text-xs py-12 text-center">No vehicles saved to your wishlist yet.</p>}
                  </div>
                )}

                {/* ── WALLET TAB ── */}
                {activeTab === 'wallet' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-6">Spend & Deposit Ledger</h2>
                    <p className="text-xs text-slate-400 mb-6">All EasyGo rental transactions are settled in cash or direct escrow at vehicle inspection.</p>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Active Security Deposits Held</span>
                      <p className="text-3xl font-black text-emerald-400 mt-1">$0.00</p>
                      <p className="text-[10px] text-slate-400 mt-2">Deposits are verified offline and released upon safe vehicle return.</p>
                    </div>
                  </div>
                )}

                {/* ── SETTINGS & SUPPORT TAB ── */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-6">Support & Concierge Assistance</h2>
                    <form onSubmit={handleTicketSubmit} className="space-y-4 max-w-lg">
                      {ticketSuccess && <p className="text-xs text-emerald-300 bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">{ticketSuccess}</p>}
                      {ticketError && <p className="text-xs text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-500/30">{ticketError}</p>}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                          placeholder="e.g. Inquiring about private airport tarmac access"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                        <textarea
                          rows="3"
                          required
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                          placeholder="Describe your request to our concierge team…"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isCreatingTicket}
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs"
                      >
                        {isCreatingTicket ? 'Submitting…' : 'Submit Ticket'}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
