import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShieldAlert,
  Car,
  Calendar,
  Users,
  Building2,
  DollarSign,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Eye,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import {
  useAdminStats,
  useAdminBookings,
  useAdminUsers,
  useAdminVehicles,
  useAdminDeleteVehicle,
  useAdminOrganizations,
  usePendingOrganizations,
  useVerifyOrganization,
} from '../api/adminApi';
import { useUpdateBooking } from '../api/bookingApi';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
  { id: 'bookings', label: 'All Bookings', icon: <Calendar className="w-4 h-4" /> },
  { id: 'vehicles', label: 'All Vehicles', icon: <Car className="w-4 h-4" /> },
  { id: 'users', label: 'All Users', icon: <Users className="w-4 h-4" /> },
  { id: 'organizations', label: 'Organizations', icon: <Building2 className="w-4 h-4" /> },
];

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('ALL');

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useAdminVehicles();
  const { mutate: deleteVehicle } = useAdminDeleteVehicle();
  const { data: organizations = [] } = useAdminOrganizations();
  const { data: pendingOrgs = [] } = usePendingOrganizations();
  const { mutate: verifyOrg } = useVerifyOrganization();
  const { mutate: updateBooking } = useUpdateBooking();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 pb-20 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Admin Authentication Required</h2>
          <p className="text-slate-400 text-sm mb-6">Please log in as an administrator to access the platform console.</p>
          <Link to="/login" className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs inline-block">
            Sign In to Console
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 pb-20 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
          <ShieldAlert className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Access Denied</h2>
          <p className="text-slate-400 text-sm mb-6">Administrator privileges are required to access this console.</p>
          <Link to="/dashboard" className="inline-block px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs">
            Go to Customer Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredBookings = bookingFilter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === bookingFilter);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'PENDING').length;

  const handleBookingAction = (id, status) => {
    if (window.confirm(`Are you sure you want to change this booking to ${status}?`)) {
      updateBooking({ id, updateData: { status } });
    }
  };

  const handleMarkPaid = (id) => {
    updateBooking({ id, updateData: { paymentStatus: 'PAID_OFFLINE', status: 'APPROVED' } });
  };

  const handleDeleteVehicle = (vehicle) => {
    if (window.confirm(`Delete ${vehicle.make} ${vehicle.model} from marketplace? This will remove all associated records.`)) {
      deleteVehicle(vehicle.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Admin Command Center
              </span>
              <span className="text-xs font-semibold text-slate-400">Platform-Wide Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              EasyGo Fleet Management & Monitoring
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Logged in as <strong className="text-emerald-400">{user.firstName} {user.lastName}</strong> ({user.email})
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              to="/messages"
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Chat Hub
            </Link>
            <Link
              to="/list"
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs transition-colors"
            >
              Host Dashboard
            </Link>
            <Link
              to="/search"
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs transition-colors shadow-lg shadow-emerald-500/25"
            >
              View Fleet
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'bookings' && pendingBookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                  {pendingBookingsCount}
                </span>
              )}
              {tab.id === 'organizations' && pendingOrgs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                  {pendingOrgs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Total Registered Users', value: stats?.users ?? 0, icon: <Users className="w-5 h-5 text-sky-400" />, border: 'border-sky-500/20' },
                { label: 'Total Listed Vehicles', value: stats?.vehicles ?? 0, icon: <Car className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/20' },
                { label: 'All-Time Bookings', value: stats?.bookings ?? 0, icon: <Calendar className="w-5 h-5 text-purple-400" />, border: 'border-purple-500/20' },
                { label: 'Fleet Organizations', value: stats?.organizations ?? 0, icon: <Building2 className="w-5 h-5 text-amber-400" />, border: 'border-amber-500/20' },
                { label: 'Pending Bookings', value: pendingBookingsCount, icon: <Clock className="w-5 h-5 text-orange-400" />, border: 'border-orange-500/20' },
                { label: 'Total Platform Volume', value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30' },
              ].map((item) => (
                <div key={item.label} className={`p-6 rounded-3xl bg-slate-900 border ${item.border} shadow-xl hover:border-white/20 transition-all`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">{item.label}</span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">{item.icon}</div>
                  </div>
                  <p className="text-3xl font-black text-white">{statsLoading ? '…' : item.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Activity Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Pending Organizations */}
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" /> Organizations Pending Verification
                  </h2>
                  <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full">
                    {pendingOrgs.length} Pending
                  </span>
                </div>
                {pendingOrgs.length > 0 ? (
                  <div className="space-y-3">
                    {pendingOrgs.map((org) => (
                      <div key={org.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white text-sm">{org.name}</p>
                          <p className="text-xs text-slate-400">Owner: {org.owner?.firstName} {org.owner?.lastName} ({org.owner?.email})</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => verifyOrg(org.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md transition-colors"
                        >
                          Approve Org
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs py-8 text-center">No organizations currently awaiting verification.</p>
                )}
              </div>

              {/* Recent Rental Requests */}
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" /> Recent Booking Activity
                  </h2>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-emerald-400 hover:underline"
                  >
                    View All ({bookings.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div>
                        <p className="font-bold text-white text-sm">{b.vehicle.make} {b.vehicle.model}</p>
                        <p className="text-[11px] text-slate-400">
                          Renter: {b.customer.firstName} {b.customer.lastName} • Host: {b.vehicle.owner ? `${b.vehicle.owner.firstName} ${b.vehicle.owner.lastName}` : 'Fleet'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          b.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          b.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          b.status === 'ACTIVE' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                          b.status === 'COMPLETED' ? 'bg-white/10 text-slate-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {b.status}
                        </span>
                        <p className="text-xs font-black text-emerald-400 mt-1">${b.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ALL BOOKINGS ── */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">All Platform Rental Requests</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Monitor and manage rental requests across all hosts and renters.</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      bookingFilter === status
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {bookingsLoading ? (
              <div className="text-center py-12 text-slate-400 font-semibold text-xs">Loading bookings…</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No bookings match the selected filter.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-3">Booking ID</th>
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Vehicle Owner</th>
                      <th className="py-3 px-3">Renter / Customer</th>
                      <th className="py-3 px-3">Rental Dates</th>
                      <th className="py-3 px-3">Total / Deposit</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Chat / Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-slate-400">#{b.id.substring(0, 8)}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-white">{b.vehicle.make} {b.vehicle.model}</p>
                          <p className="text-[11px] text-emerald-400">${b.vehicle.dailyPrice}/day</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-slate-200">
                            {b.vehicle.owner ? `${b.vehicle.owner.firstName} ${b.vehicle.owner.lastName}` : b.vehicle.organization?.name || 'Fleet'}
                          </p>
                          <p className="text-[11px] text-slate-400">{b.vehicle.owner?.email || ''}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-slate-200">{b.customer.firstName} {b.customer.lastName}</p>
                          <p className="text-[11px] text-slate-400">{b.customer.email}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-medium text-slate-200">{new Date(b.startDate).toLocaleDateString()}</p>
                          <p className="text-[11px] text-slate-400">to {new Date(b.endDate).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-black text-white">${b.totalAmount}</p>
                          <p className="text-[11px] text-slate-400">Dep: ${b.securityDeposit}</p>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            b.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            b.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            b.status === 'ACTIVE' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                            b.status === 'COMPLETED' ? 'bg-white/10 text-slate-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            b.payment?.status === 'PAID_OFFLINE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-400'
                          }`}>
                            {b.payment?.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/messages/${b.id}`}
                              className="px-2.5 py-1 bg-white/10 hover:bg-emerald-500 hover:text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                              title="Inspect chat between renter and host"
                            >
                              <MessageSquare className="w-3 h-3" /> Chat
                            </Link>
                            {b.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleBookingAction(b.id, 'APPROVED')}
                                  className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-[10px] font-black shadow-sm"
                                  title="Approve rental request"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBookingAction(b.id, 'REJECTED')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black shadow-sm"
                                  title="Reject rental request"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {b.status === 'APPROVED' && (
                              <button
                                type="button"
                                onClick={() => handleBookingAction(b.id, 'ACTIVE')}
                                className="px-2 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-[10px] font-black"
                              >
                                Start Trip
                              </button>
                            )}
                            {b.status === 'ACTIVE' && (
                              <button
                                type="button"
                                onClick={() => handleBookingAction(b.id, 'COMPLETED')}
                                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[10px] font-black"
                              >
                                Complete
                              </button>
                            )}
                            {b.payment?.status === 'PENDING' && (
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(b.id)}
                                className="px-2 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-black"
                                title="Mark payment verified offline"
                              >
                                Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: ALL VEHICLES ── */}
        {activeTab === 'vehicles' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">All Platform Vehicles ({vehicles.length})</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Monitor all vehicle inventory across cars, superbikes, watercraft, and fleets.</p>
              </div>
              <Link
                to="/list"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/25"
              >
                + Add Vehicle
              </Link>
            </div>

            {vehiclesLoading ? (
              <div className="text-center py-12 text-slate-400 font-semibold text-xs">Loading vehicles…</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No vehicles registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Host / Fleet</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Daily Rate</th>
                      <th className="py-3 px-3">Deposit</th>
                      <th className="py-3 px-3">Bookings</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-3 font-bold text-white">
                          <div className="flex items-center gap-3">
                            {v.images?.[0]?.url ? (
                              <img
                                src={v.images[0].url.startsWith('http') ? v.images[0].url : `${apiBase}${v.images[0].url}`}
                                alt={v.model}
                                className="w-14 h-10 object-cover rounded-xl border border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                                <Car className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span>{v.make} {v.model}</span>
                              <span className="text-[11px] text-slate-400 block font-normal">{v.year}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 font-semibold text-emerald-400">{v.type}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-slate-200">
                            {v.owner ? `${v.owner.firstName} ${v.owner.lastName}` : v.organization?.name || 'Organization'}
                          </p>
                          <p className="text-[11px] text-slate-400">{v.owner?.email || ''}</p>
                        </td>
                        <td className="py-4 px-3 font-medium text-slate-300">{v.location}</td>
                        <td className="py-4 px-3 font-black text-white">${v.dailyPrice}</td>
                        <td className="py-4 px-3 font-medium text-slate-400">${v.securityDeposit}</td>
                        <td className="py-4 px-3 font-black text-emerald-400">{v._count?.bookings || 0}</td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/vehicles/${v.id}`}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
                              title="View listing"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteVehicle(v)}
                              className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors"
                              title="Delete vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: ALL USERS ── */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white">Platform Users ({users.length})</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Complete directory of registered renters, vehicle hosts, and administrators.</p>
            </div>

            {usersLoading ? (
              <div className="text-center py-12 text-slate-400 font-semibold text-xs">Loading users…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Verified</th>
                      <th className="py-3 px-3">Listings</th>
                      <th className="py-3 px-3">Bookings</th>
                      <th className="py-3 px-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-3 font-bold text-white">{u.firstName} {u.lastName}</td>
                        <td className="py-4 px-3 font-medium text-slate-300">{u.email}</td>
                        <td className="py-4 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            u.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            u.role === 'OWNER' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-bold">
                          {u.isVerified ? (
                            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Yes</span>
                          ) : (
                            <span className="text-slate-500">No</span>
                          )}
                        </td>
                        <td className="py-4 px-3 font-black text-slate-200">{u._count?.vehicles || 0}</td>
                        <td className="py-4 px-3 font-black text-slate-200">{u._count?.bookings || 0}</td>
                        <td className="py-4 px-3 text-[11px] text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: ORGANIZATIONS ── */}
        {activeTab === 'organizations' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white">Commercial Fleets & Organizations ({organizations.length})</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Monitor commercial fleet operators and approve pending business registrations.</p>
            </div>

            {organizations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No commercial organizations registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-3">Organization Name</th>
                      <th className="py-3 px-3">Owner / Contact</th>
                      <th className="py-3 px-3">Business Reg No</th>
                      <th className="py-3 px-3">GST Number</th>
                      <th className="py-3 px-3">Fleet Size</th>
                      <th className="py-3 px-3">Verification</th>
                      <th className="py-3 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-3 font-bold text-white">{org.name}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-slate-200">{org.owner?.firstName} {org.owner?.lastName}</p>
                          <p className="text-[11px] text-slate-400">{org.owner?.email}</p>
                        </td>
                        <td className="py-4 px-3 font-mono text-slate-300">{org.businessRegNo || 'N/A'}</td>
                        <td className="py-4 px-3 font-mono text-slate-300">{org.gstNumber || 'N/A'}</td>
                        <td className="py-4 px-3 font-black text-emerald-400">{org._count?.vehicles || 0}</td>
                        <td className="py-4 px-3">
                          {org.isVerified ? (
                            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-black">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          {!org.isVerified && (
                            <button
                              type="button"
                              onClick={() => verifyOrg(org.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md transition-colors"
                            >
                              Verify Org
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
