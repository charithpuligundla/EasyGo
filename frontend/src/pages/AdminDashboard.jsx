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

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Layers className="w-5 h-5" /> },
  { id: 'bookings', label: 'All Bookings', icon: <Calendar className="w-5 h-5" /> },
  { id: 'vehicles', label: 'All Vehicles', icon: <Car className="w-5 h-5" /> },
  { id: 'users', label: 'All Users', icon: <Users className="w-5 h-5" /> },
  { id: 'organizations', label: 'Organizations', icon: <Building2 className="w-5 h-5" /> },
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
      <div className="min-h-screen pt-32 text-center">
        <p className="text-gray-800 font-bold mb-4">Please log in as an administrator.</p>
        <Link to="/login" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold">Sign in</Link>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-800">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-700 font-medium">Administrator privileges are required to access this console.</p>
        <Link to="/dashboard" className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold">
          Go to customer dashboard
        </Link>
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-sm font-semibold text-gray-600">Platform-Wide Oversight</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              System Management & Monitoring
            </h1>
            <p className="text-gray-700 font-medium mt-1">
              Logged in as <strong className="text-gray-900">{user.firstName} {user.lastName}</strong> ({user.email})
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/list"
              className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              Host Dashboard
            </Link>
            <Link
              to="/search"
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm"
            >
              View Marketplace
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'bookings' && pendingBookingsCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white">
                  {pendingBookingsCount}
                </span>
              )}
              {tab.id === 'organizations' && pendingOrgs.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-red-500 text-white">
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
                { label: 'Total Registered Users', value: stats?.users ?? 0, icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50 border-blue-100' },
                { label: 'Total Listed Vehicles', value: stats?.vehicles ?? 0, icon: <Car className="w-6 h-6 text-green-600" />, bg: 'bg-green-50 border-green-100' },
                { label: 'All-Time Bookings', value: stats?.bookings ?? 0, icon: <Calendar className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50 border-purple-100' },
                { label: 'Fleet Organizations', value: stats?.organizations ?? 0, icon: <Building2 className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
                { label: 'Pending Bookings', value: pendingBookingsCount, icon: <Clock className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50 border-orange-100' },
                { label: 'Total Platform Volume', value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
              ].map((item) => (
                <div key={item.label} className={`p-6 rounded-3xl border shadow-sm ${item.bg}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">{item.label}</span>
                    <div className="p-2 rounded-xl bg-white shadow-sm">{item.icon}</div>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">{statsLoading ? '…' : item.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Activity Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Pending Organizations */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-600" /> Organizations Pending Verification
                  </h2>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                    {pendingOrgs.length} Pending
                  </span>
                </div>
                {pendingOrgs.length > 0 ? (
                  <div className="space-y-4">
                    {pendingOrgs.map((org) => (
                      <div key={org.id} className="p-4 rounded-2xl border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900 text-base">{org.name}</p>
                          <p className="text-sm text-gray-600">Owner: {org.owner?.firstName} {org.owner?.lastName} ({org.owner?.email})</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => verifyOrg(org.id)}
                          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-sm transition-colors"
                        >
                          Approve Organization
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 font-medium py-8 text-center">No organizations currently awaiting verification.</p>
                )}
              </div>

              {/* Recent Rental Requests */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" /> Recent Booking Activity
                  </h2>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-sm font-bold text-primary-600 hover:underline"
                  >
                    View All ({bookings.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900">{b.vehicle.make} {b.vehicle.model}</p>
                        <p className="text-xs text-gray-600 font-medium">
                          Renter: {b.customer.firstName} {b.customer.lastName} • Host: {b.vehicle.owner ? `${b.vehicle.owner.firstName} ${b.vehicle.owner.lastName}` : 'Fleet'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          b.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {b.status}
                        </span>
                        <p className="text-xs font-bold text-gray-900 mt-1">${b.totalAmount}</p>
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
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Platform Rental Requests</h2>
                <p className="text-gray-600 font-medium">Monitor and manage rental requests across all hosts and renters.</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {['ALL', 'PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      bookingFilter === status
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {bookingsLoading ? (
              <div className="text-center py-12 text-gray-600 font-semibold">Loading bookings…</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-600 font-medium">No bookings match the selected filter.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-700 uppercase tracking-wide text-xs">
                      <th className="py-3 px-3 font-bold">Booking ID</th>
                      <th className="py-3 px-3 font-bold">Vehicle</th>
                      <th className="py-3 px-3 font-bold">Vehicle Owner</th>
                      <th className="py-3 px-3 font-bold">Renter / Customer</th>
                      <th className="py-3 px-3 font-bold">Rental Dates</th>
                      <th className="py-3 px-3 font-bold">Total / Deposit</th>
                      <th className="py-3 px-3 font-bold">Status</th>
                      <th className="py-3 px-3 font-bold">Payment</th>
                      <th className="py-3 px-3 font-bold">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-gray-700">{b.id.substring(0, 8)}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-900">{b.vehicle.make} {b.vehicle.model}</p>
                          <p className="text-xs text-gray-500 font-medium">${b.vehicle.dailyPrice}/day</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-800">
                            {b.vehicle.owner ? `${b.vehicle.owner.firstName} ${b.vehicle.owner.lastName}` : b.vehicle.organization?.name || 'Org'}
                          </p>
                          <p className="text-xs text-gray-500">{b.vehicle.owner?.email || ''}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-800">{b.customer.firstName} {b.customer.lastName}</p>
                          <p className="text-xs text-gray-500">{b.customer.email}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-semibold text-gray-800">{new Date(b.startDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">to {new Date(b.endDate).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-900">${b.totalAmount}</p>
                          <p className="text-xs text-gray-500 font-medium">Dep: ${b.securityDeposit}</p>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            b.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            b.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            b.payment?.status === 'PAID_OFFLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {b.payment?.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {b.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleBookingAction(b.id, 'APPROVED')}
                                  className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold"
                                  title="Approve rental request"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBookingAction(b.id, 'REJECTED')}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
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
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold"
                              >
                                Start Rental
                              </button>
                            )}
                            {b.status === 'ACTIVE' && (
                              <button
                                type="button"
                                onClick={() => handleBookingAction(b.id, 'COMPLETED')}
                                className="px-2.5 py-1 bg-gray-800 hover:bg-black text-white rounded text-xs font-bold"
                              >
                                Complete
                              </button>
                            )}
                            {b.payment?.status === 'PENDING' && (
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(b.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                                title="Mark payment verified offline"
                              >
                                Mark Paid
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
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Listed Vehicles ({vehicles.length})</h2>
                <p className="text-gray-600 font-medium">Monitor all vehicle inventory across individual hosts and fleets.</p>
              </div>
              <Link
                to="/list"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm"
              >
                + Add Vehicle
              </Link>
            </div>

            {vehiclesLoading ? (
              <div className="text-center py-12 text-gray-600 font-semibold">Loading vehicles…</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-600 font-medium">No vehicles registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-700 uppercase tracking-wide text-xs">
                      <th className="py-3 px-3 font-bold">Vehicle</th>
                      <th className="py-3 px-3 font-bold">Type</th>
                      <th className="py-3 px-3 font-bold">Host / Owner</th>
                      <th className="py-3 px-3 font-bold">Location</th>
                      <th className="py-3 px-3 font-bold">Daily Price</th>
                      <th className="py-3 px-3 font-bold">Deposit</th>
                      <th className="py-3 px-3 font-bold">Bookings</th>
                      <th className="py-3 px-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-3 font-bold text-gray-900">
                          {v.make} {v.model} ({v.year})
                        </td>
                        <td className="py-4 px-3 font-semibold text-gray-700">{v.type}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-800">
                            {v.owner ? `${v.owner.firstName} ${v.owner.lastName}` : v.organization?.name || 'Organization'}
                          </p>
                          <p className="text-xs text-gray-500">{v.owner?.email || ''}</p>
                        </td>
                        <td className="py-4 px-3 font-medium text-gray-700">{v.location}</td>
                        <td className="py-4 px-3 font-bold text-gray-900">${v.dailyPrice}</td>
                        <td className="py-4 px-3 font-medium text-gray-700">${v.securityDeposit}</td>
                        <td className="py-4 px-3 font-bold text-primary-700">{v._count?.bookings || 0}</td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/vehicles/${v.id}`}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
                              title="View listing"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteVehicle(v)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
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
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Platform Users ({users.length})</h2>
              <p className="text-gray-600 font-medium">Complete directory of registered renters, vehicle hosts, and administrators.</p>
            </div>

            {usersLoading ? (
              <div className="text-center py-12 text-gray-600 font-semibold">Loading users…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-700 uppercase tracking-wide text-xs">
                      <th className="py-3 px-3 font-bold">User</th>
                      <th className="py-3 px-3 font-bold">Email</th>
                      <th className="py-3 px-3 font-bold">Role</th>
                      <th className="py-3 px-3 font-bold">Verified</th>
                      <th className="py-3 px-3 font-bold">Listings</th>
                      <th className="py-3 px-3 font-bold">Bookings</th>
                      <th className="py-3 px-3 font-bold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-3 font-bold text-gray-900">{u.firstName} {u.lastName}</td>
                        <td className="py-4 px-3 font-medium text-gray-700">{u.email}</td>
                        <td className="py-4 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-bold">
                          {u.isVerified ? (
                            <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Yes</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="py-4 px-3 font-bold text-gray-800">{u._count?.vehicles || 0}</td>
                        <td className="py-4 px-3 font-bold text-gray-800">{u._count?.bookings || 0}</td>
                        <td className="py-4 px-3 text-xs text-gray-600 font-medium">
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
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Commercial Fleets & Organizations ({organizations.length})</h2>
              <p className="text-gray-600 font-medium">Monitor commercial fleet operators and approve pending business registrations.</p>
            </div>

            {organizations.length === 0 ? (
              <div className="text-center py-12 text-gray-600 font-medium">No commercial organizations registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-700 uppercase tracking-wide text-xs">
                      <th className="py-3 px-3 font-bold">Organization Name</th>
                      <th className="py-3 px-3 font-bold">Owner / Contact</th>
                      <th className="py-3 px-3 font-bold">Business Reg No</th>
                      <th className="py-3 px-3 font-bold">GST Number</th>
                      <th className="py-3 px-3 font-bold">Fleet Size</th>
                      <th className="py-3 px-3 font-bold">Verification Status</th>
                      <th className="py-3 px-3 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.map((org) => (
                      <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-3 font-bold text-gray-900">{org.name}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-gray-800">{org.owner?.firstName} {org.owner?.lastName}</p>
                          <p className="text-xs text-gray-500">{org.owner?.email}</p>
                        </td>
                        <td className="py-4 px-3 font-mono font-medium text-gray-700">{org.businessRegNo || 'N/A'}</td>
                        <td className="py-4 px-3 font-mono font-medium text-gray-700">{org.gstNumber || 'N/A'}</td>
                        <td className="py-4 px-3 font-bold text-primary-700">{org._count?.vehicles || 0}</td>
                        <td className="py-4 px-3">
                          {org.isVerified ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                              Verified
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          {!org.isVerified && (
                            <button
                              type="button"
                              onClick={() => verifyOrg(org.id)}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm transition-colors"
                            >
                              Verify
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
