import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, CalendarClock, Heart, Wallet, Settings, 
  ShieldCheck, Clock, ChevronRight, XCircle, AlertCircle, CheckCircle2
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
  { id: 'bookings', label: 'My Rentals', icon: <CalendarClock className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
  { id: 'wallet', label: 'Wallet & Spend', icon: <Wallet className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings & Support', icon: <Settings className="w-5 h-5" /> },
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
  const { data: notificationsList = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { data: supportTickets = [] } = useSupportTickets();
  const { mutate: createTicket, isPending: isCreatingTicket } = useCreateSupportTicket();
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '' });
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  const walletTotal = walletItems.reduce((sum, item) => sum + (item.type === 'CREDIT' ? -item.amount : item.amount), 0);

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

  if (!user) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-800">
        <p className="text-xl font-bold mb-4">Please log in to view your dashboard.</p>
        <Link to="/login" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold inline-block shadow-md">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700 shrink-0 border-2 border-primary-200">
            {user.firstName?.charAt(0) || 'U'}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center md:justify-start gap-2">
              {user.firstName} {user.lastName} <ShieldCheck className="w-6 h-6 text-primary-600" />
            </h1>
            <p className="text-gray-600 font-medium">{user.email} • Role: <strong className="text-gray-900">{user.role}</strong></p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold">
                {bookings ? bookings.length : 0} Total Bookings
              </span>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="px-3 py-1 bg-red-100 text-red-800 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors">
                  🛡️ Open Admin Console
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <Link to="/list" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-center text-sm shadow-sm">
              Host / List Vehicle
            </Link>
            <button onClick={onLogout} className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-5 py-2.5 rounded-xl font-bold transition-all text-center text-sm">
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm sticky top-28">
              <nav className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left font-bold text-sm ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm min-h-[500px]"
              >
                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Rental Requests & History</h2>
                      <Link to="/search" className="text-sm font-bold text-primary-600 hover:underline">
                        + Rent Another Vehicle
                      </Link>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-12 text-gray-600 font-semibold">Loading your bookings…</div>
                    ) : isError ? (
                      <div className="text-center text-red-600 py-8 font-semibold">Failed to load bookings.</div>
                    ) : !bookings || bookings.length === 0 ? (
                      <div className="text-center py-16 text-gray-600">
                        <CalendarClock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-xl font-bold text-gray-800">You have no rental requests yet</p>
                        <p className="text-sm text-gray-500 mt-1 mb-6">Browse our wide selection of cars, SUVs, and luxury rides.</p>
                        <Link to="/search" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold inline-block shadow-md hover:bg-primary-700 transition-colors">
                          Find a Vehicle
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border border-gray-200 rounded-2xl p-5 md:p-6 bg-white hover:border-gray-300 transition-colors shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6">
                              <img 
                                src={booking.vehicle?.images?.[0]?.url ? `${apiBase}${booking.vehicle.images[0].url}` : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600'} 
                                alt={`${booking.vehicle?.make} ${booking.vehicle?.model}`} 
                                className="w-full md:w-52 h-36 object-cover rounded-xl shrink-0" 
                              />
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                    <div>
                                      <h3 className="text-xl font-bold text-gray-900">{booking.vehicle?.make} {booking.vehicle?.model}</h3>
                                      <p className="text-xs font-mono font-semibold text-gray-500 mt-0.5">Booking Ref: {booking.id.substring(0, 8)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                      booking.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                                      booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {booking.status === 'PENDING' ? 'Awaiting Owner Approval' : booking.status}
                                    </span>
                                  </div>

                                  {/* Status Explanatory Alert */}
                                  {booking.status === 'PENDING' && (
                                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                      <span>Your request was sent to the vehicle owner. Waiting for owner to accept or decline.</span>
                                    </div>
                                  )}
                                  {booking.status === 'APPROVED' && (
                                    <div className="bg-green-50 border border-green-200 p-3 rounded-xl text-xs font-bold text-green-900 mb-3 flex items-center gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                      <span>Request accepted by owner! Please prepare ${booking.totalAmount} for offline payment upon vehicle pickup.</span>
                                    </div>
                                  )}
                                  {booking.status === 'REJECTED' && (
                                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs font-semibold text-red-900 mb-3 flex items-center gap-2">
                                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                      <span>The owner was unable to accommodate this rental request.</span>
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-700">
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4 text-primary-600" />
                                      {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                                    </span>
                                    <span>
                                      Location: <strong>{booking.vehicle?.location || 'Pickup Location'}</strong>
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap justify-between items-end mt-4 pt-4 border-t border-gray-100 gap-4">
                                  <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total to Pay Offline</p>
                                    <p className="text-2xl font-extrabold text-gray-900">${booking.totalAmount}</p>
                                    <p className="text-xs font-medium text-gray-500">Includes ${booking.securityDeposit} refundable deposit</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 items-center">
                                    {booking.status === 'PENDING' && (
                                      <button
                                        type="button"
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="px-4 py-2 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                                      >
                                        Cancel Request
                                      </button>
                                    )}
                                    <Link
                                      to={`/messages/${booking.id}`}
                                      className="px-4 py-2 text-xs font-bold text-gray-800 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                      Chat with Host
                                    </Link>
                                    <Link
                                      to={`/vehicles/${booking.vehicleId}`}
                                      className="px-4 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-sm"
                                    >
                                      View Vehicle
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                    <div className="space-y-4 max-w-lg">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                        <p className="font-bold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                        <p className="font-bold text-gray-900 text-lg">{user.email}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Account Role</label>
                        <p className="font-bold text-gray-900 text-lg">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── WISHLIST TAB ── */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Vehicles ({favorites.length})</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {favorites.map((vehicle) => (
                        <div key={vehicle.id} className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-white shadow-sm">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{vehicle.make} {vehicle.model}</h3>
                            <p className="text-sm font-semibold text-primary-700">${vehicle.dailyPrice}/day</p>
                          </div>
                          <div className="flex gap-2">
                            <Link className="px-3 py-1.5 border border-gray-300 text-gray-800 font-bold text-xs rounded-lg hover:bg-gray-50" to={`/vehicles/${vehicle.id}`}>View</Link>
                            <Link className="px-3 py-1.5 bg-primary-600 text-white font-bold text-xs rounded-lg hover:bg-primary-700" to={`/book/${vehicle.id}`}>Book</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    {favorites.length === 0 && <p className="text-gray-600 font-medium py-12 text-center">You haven't saved any vehicles to your wishlist yet.</p>}
                  </div>
                )}

                {/* ── WALLET TAB ── */}
                {activeTab === 'wallet' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet & Offline Spend Summary</h2>
                    <div className="p-6 rounded-2xl bg-green-50 border border-green-200 mb-6">
                      <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Estimated Offline Spend</p>
                      <p className="text-4xl font-extrabold text-gray-900 mt-2">${walletTotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-700 font-medium mt-2">All vehicle payments and security deposits are settled directly with the host at pickup.</p>
                    </div>
                    <div className="space-y-3">
                      {walletItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 py-3">
                          <span className="font-semibold text-gray-800">{item.description}</span>
                          <span className="font-bold text-gray-900">${item.amount}</span>
                        </div>
                      ))}
                      {walletItems.length === 0 && <p className="text-gray-500 font-medium text-sm py-4">No recorded wallet transactions.</p>}
                    </div>
                  </div>
                )}

                {/* ── SETTINGS & SUPPORT TAB ── */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings & Help Desk</h2>
                    <label className="flex items-center justify-between border-b border-gray-200 py-4 cursor-pointer">
                      <span className="text-gray-800 font-bold">Booking SMS & Email Notifications</span>
                      <input type="checkbox" checked={bookingAlerts} onChange={(event) => setBookingAlerts(event.target.checked)} className="w-5 h-5 accent-green-600" />
                    </label>
                    {bookingAlerts && (
                      <div className="mt-6 space-y-2">
                        <h3 className="font-bold text-gray-900">Recent Notifications</h3>
                        {notificationsList.length === 0 && <p className="text-sm text-gray-500">No new notifications.</p>}
                        {notificationsList.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => !n.isRead && markRead(n.id)}
                            className={`w-full text-left p-3.5 rounded-xl text-sm border transition-colors ${n.isRead ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'}`}
                          >
                            <p className="font-bold text-gray-900">{n.title}</p>
                            <p className="text-gray-700 font-medium mt-0.5">{n.message}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-10">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">Support Tickets</h3>
                      {ticketError && (
                        <div className="mb-4 p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-xl text-sm font-semibold">
                          {ticketError}
                        </div>
                      )}
                      {ticketSuccess && (
                        <div className="mb-4 p-3.5 bg-green-50 border border-green-300 text-green-800 rounded-xl text-sm font-semibold">
                          {ticketSuccess}
                        </div>
                      )}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setTicketError('');
                          setTicketSuccess('');
                          createTicket(ticketForm, {
                            onSuccess: () => {
                              setTicketForm({ subject: '', description: '' });
                              setTicketSuccess('Support ticket created successfully. Our team will assist you shortly.');
                            },
                            onError: (err) => {
                              setTicketError(err?.response?.data?.message || 'Failed to submit support ticket. Please try again.');
                            },
                          });
                        }}
                        className="space-y-3 max-w-lg mb-6"
                      >
                        <input
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                          placeholder="Subject"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <textarea
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                          placeholder="Describe your issue or question…"
                          required
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button type="submit" disabled={isCreatingTicket} className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm disabled:opacity-50 shadow-sm">
                          {isCreatingTicket ? 'Submitting…' : 'Open Ticket'}
                        </button>
                      </form>
                      {supportTickets.map((t) => (
                        <p key={t.id} className="text-sm font-semibold text-gray-800 mb-1">{t.subject} — <span className="font-bold text-primary-700">{t.status}</span></p>
                      ))}
                    </div>
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
