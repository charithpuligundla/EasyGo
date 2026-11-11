import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Car, Users, TrendingUp, Calendar, Plus,
  MoreVertical, Edit, Trash2, CheckCircle, X
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useVehicles, useCreateVehicle, useDeleteVehicle, useUpdateVehicle } from '../api/vehicleApi';
import { useMyOrganizations, useCreateOrganization } from '../api/orgApi';
import { useOwnerBookings, useUpdateBooking } from '../api/bookingApi';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'fleet', label: 'Fleet Management', icon: <Car className="w-5 h-5" /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
  { id: 'organization', label: 'Organization', icon: <Building2 className="w-5 h-5" /> },
  { id: 'employees', label: 'Employees', icon: <Users className="w-5 h-5" /> },
];

const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('fleet');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [createError, setCreateError] = useState('');
  const [editError, setEditError] = useState('');
  const [orgError, setOrgError] = useState('');
  const [orgSuccess, setOrgSuccess] = useState('');

  const { user } = useSelector((state) => state.auth);

  const { data: fleet, isLoading } = useVehicles({ ownerId: user?.id });
  const { mutate: createVehicle, isPending: isCreating } = useCreateVehicle();
  const { mutate: deleteVehicle } = useDeleteVehicle();
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();
  const { data: bookings, isLoading: areBookingsLoading } = useOwnerBookings();
  const { mutate: updateBooking } = useUpdateBooking();

  const { data: myOrgs, isLoading: isOrgLoading } = useMyOrganizations();
  const { mutate: createOrg, isPending: isOrgCreating } = useCreateOrganization();

  const [orgFormData, setOrgFormData] = useState({ name: '', businessRegNo: '', gstNumber: '' });

  const emptyForm = {
    make: '', model: '', year: '', type: 'Sedan', description: '',
    dailyPrice: '', securityDeposit: '', location: '', seats: '5',
    transmission: 'Automatic', fuelType: 'Petrol',
  };
  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOrgInputChange = (e) => setOrgFormData({ ...orgFormData, [e.target.name]: e.target.value });

  const handleOrgSubmit = (e) => {
    e.preventDefault();
    setOrgError('');
    setOrgSuccess('');
    createOrg(orgFormData, {
      onSuccess: () => {
        setOrgFormData({ name: '', businessRegNo: '', gstNumber: '' });
        setOrgSuccess('Organization registered successfully! Pending administrator verification.');
      },
      onError: (err) => {
        setOrgError(err?.response?.data?.message || 'Failed to register organization. Please check details.');
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreateError('');
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    vehicleImages.forEach((file) => data.append('vehicleImages', file));

    createVehicle(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setFormData(emptyForm);
        setVehicleImages([]);
      },
      onError: (err) => {
        setCreateError(err?.response?.data?.message || 'Failed to add vehicle. Check all fields.');
      },
    });
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditError('');
    setFormData({
      make: vehicle.make, model: vehicle.model, year: String(vehicle.year),
      type: vehicle.type, description: vehicle.description,
      dailyPrice: String(vehicle.dailyPrice), securityDeposit: String(vehicle.securityDeposit),
      location: vehicle.location, seats: String(vehicle.seats || 5),
      transmission: vehicle.transmission || 'Automatic', fuelType: vehicle.fuelType || 'Petrol',
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditError('');
    if (!editingVehicle) return;
    updateVehicle(
      { id: editingVehicle.id, vehicleData: formData },
      {
        onSuccess: () => {
          setEditingVehicle(null);
          setEditError('');
        },
        onError: (err) => {
          setEditError(err?.response?.data?.message || 'Failed to update vehicle details. Please check values.');
        },
      }
    );
  };

  const handleDeleteVehicle = (vehicle) => {
    if (window.confirm(`Remove ${vehicle.make} ${vehicle.model} from your fleet?`)) deleteVehicle(vehicle.id);
  };

  const handleBookingStatus = (id, status) => updateBooking({ id, updateData: { status } });
  const handleMarkPaid = (id) => updateBooking({ id, updateData: { paymentStatus: 'PAID_OFFLINE', status: 'APPROVED' } });

  if (!user) {
    return <div className="min-h-screen pt-32 text-center text-gray-700 font-semibold">Please log in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100">
            <Building2 className="w-12 h-12 text-primary-600" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center md:justify-start gap-2">
              {user.firstName} {user.lastName}'s Fleet <CheckCircle className="w-6 h-6 text-green-600" />
            </h1>
            <p className="text-gray-600 font-medium mb-4">{user.role === 'ADMIN' ? 'Verified Organization' : 'Individual Host'} • {fleet?.length || 0} Vehicles</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm font-bold text-green-800">
                Active Listings
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-4 sticky top-28">
              <nav className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left font-semibold ${
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

          {/* Main Content */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8 min-h-[500px]"
              >
                {/* ── FLEET TAB ── */}
                {activeTab === 'fleet' && (
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">Fleet Management</h2>
                      <button
                        onClick={() => { setIsAddModalOpen(true); setCreateError(''); setFormData(emptyForm); }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Plus className="w-5 h-5" /> Add Vehicle
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">ID</th>
                            <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Vehicle</th>
                            <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Type</th>
                            <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Status</th>
                            <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Price/Day</th>
                            <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading && <tr><td colSpan="6" className="text-center py-8 text-gray-600 font-medium">Loading vehicles…</td></tr>}
                          {fleet && fleet.length === 0 && <tr><td colSpan="6" className="text-center py-10 text-gray-600 font-medium">No vehicles listed yet. Click <strong>"Add Vehicle"</strong> to start!</td></tr>}
                          {fleet && fleet.map((vehicle) => (
                            <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-4 font-mono text-sm font-semibold text-gray-600">{vehicle.id.substring(0, 6)}</td>
                              <td className="py-4 px-4 font-bold text-gray-900">{vehicle.make} {vehicle.model}</td>
                              <td className="py-4 px-4 font-semibold text-gray-700">{vehicle.type}</td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {vehicle.status || 'AVAILABLE'}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-bold text-gray-900">${vehicle.dailyPrice}</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1">
                                  <button type="button" onClick={() => openEditModal(vehicle)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteVehicle(vehicle)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-gray-700 rounded-lg">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── ORGANIZATION TAB ── */}
                {activeTab === 'organization' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Organization Profile</h2>
                    {isOrgLoading ? (
                      <div className="text-center py-12 text-gray-600">Loading…</div>
                    ) : myOrgs && myOrgs.length > 0 ? (
                      <div className="space-y-6">
                        {myOrgs.map((org) => (
                          <div key={org.id} className="p-6 border border-gray-200 rounded-2xl bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">{org.name}</h3>
                            <p className="text-sm text-gray-600 font-medium mt-2">Verified: {org.isVerified ? 'Yes ✅' : 'Pending…'}</p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-bold text-gray-700">Business Reg No</p>
                                <p className="text-gray-900 font-semibold mt-1">{org.businessRegNo || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-700">GST Number</p>
                                <p className="text-gray-900 font-semibold mt-1">{org.gstNumber || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <form onSubmit={handleOrgSubmit} className="space-y-5 max-w-lg">
                        {orgError && (
                          <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm font-semibold">
                            {orgError}
                          </div>
                        )}
                        {orgSuccess && (
                          <div className="p-4 rounded-xl bg-green-50 border border-green-300 text-green-800 text-sm font-semibold">
                            {orgSuccess}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-1.5">Organization Name</label>
                          <input type="text" name="name" value={orgFormData.name} onChange={handleOrgInputChange} required className={inputCls} placeholder="e.g. Eco Fleet LLC" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-1.5">Business Registration No (Optional)</label>
                          <input type="text" name="businessRegNo" value={orgFormData.businessRegNo} onChange={handleOrgInputChange} className={inputCls} placeholder="BRN-XXXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-1.5">GST Number (Optional)</label>
                          <input type="text" name="gstNumber" value={orgFormData.gstNumber} onChange={handleOrgInputChange} className={inputCls} placeholder="GST-XXXX" />
                        </div>
                        <button type="submit" disabled={isOrgCreating} className="px-6 py-3 font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50">
                          {isOrgCreating ? 'Registering…' : 'Register Organization'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Fleet Overview</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                        <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Listed Vehicles</p>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{fleet?.length || 0}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Booking Requests</p>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{bookings?.length || 0}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                        <p className="text-sm font-bold text-amber-700 uppercase tracking-wide">Pending Review</p>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{(bookings || []).filter((b) => b.status === 'PENDING').length}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium mt-8">Keep vehicle details and availability current to make booking handoffs smooth.</p>
                  </div>
                )}

                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Incoming Rental Requests</h2>
                        <p className="text-gray-600 font-medium">As the vehicle owner, you decide which rental requests to accept or decline.</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                        {(bookings || []).filter((b) => b.status === 'PENDING').length} Pending Review
                      </span>
                    </div>

                    {areBookingsLoading ? (
                      <p className="text-gray-600 font-medium py-12 text-center">Loading rental requests…</p>
                    ) : bookings?.length ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border border-gray-200 rounded-2xl p-6 bg-white hover:border-gray-300 transition-colors shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-bold text-gray-900 text-xl">{booking.vehicle.make} {booking.vehicle.model}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                                    booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status === 'PENDING' ? 'Awaiting Your Approval' : booking.status}
                                  </span>
                                </div>

                                <p className="text-gray-800 font-semibold">
                                  Renter: {booking.customer.firstName} {booking.customer.lastName} • <span className="text-gray-600">{booking.customer.email}</span>
                                  {booking.customer.phone && <span className="text-gray-600"> • {booking.customer.phone}</span>}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
                                  <span>📅 {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</span>
                                  <span>💰 Total: <strong>${booking.totalAmount}</strong></span>
                                  <span>🛡️ Security Deposit: <strong>${booking.securityDeposit}</strong></span>
                                </div>

                                <div className="text-xs font-bold">
                                  Payment Status:{' '}
                                  <span className={booking.payment?.status === 'PAID_OFFLINE' ? 'text-green-700 font-extrabold' : 'text-amber-700'}>
                                    {booking.payment?.status === 'PAID_OFFLINE' ? 'Paid & Verified Offline ✅' : 'Payment Due at Pickup'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-2">
                                {booking.status === 'PENDING' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleBookingStatus(booking.id, 'APPROVED')}
                                      className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 shadow-sm"
                                    >
                                      ✓ Accept Request
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleBookingStatus(booking.id, 'REJECTED')}
                                      className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-sm"
                                    >
                                      ✕ Decline Request
                                    </button>
                                  </>
                                )}

                                {booking.status === 'APPROVED' && (
                                  <>
                                    {booking.payment?.status !== 'PAID_OFFLINE' && (
                                      <button
                                        type="button"
                                        onClick={() => handleMarkPaid(booking.id)}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-sm"
                                      >
                                        Verify Offline Payment
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleBookingStatus(booking.id, 'ACTIVE')}
                                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-sm"
                                    >
                                      Hand Over Vehicle (Start Trip)
                                    </button>
                                  </>
                                )}

                                {booking.status === 'ACTIVE' && (
                                  <button
                                    type="button"
                                    onClick={() => handleBookingStatus(booking.id, 'COMPLETED')}
                                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 shadow-sm"
                                  >
                                    Complete Rental & Return
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-600 font-medium">
                        <p className="text-lg">No rental requests received yet.</p>
                        <p className="text-sm text-gray-500 mt-1">When customers submit booking requests for your vehicles, they will appear here for your review and approval.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── EMPLOYEES TAB ── */}
                {activeTab === 'employees' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Access</h2>
                    <div className="p-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
                      <p className="font-bold text-gray-900 text-lg">Owner access</p>
                      <p className="text-gray-700 font-medium mt-1">{user.email} has full fleet and booking access.</p>
                      <p className="text-sm text-gray-600 mt-4">Employee invitations are available after an organization is verified.</p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── ADD VEHICLE MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">List a New Vehicle</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {createError && (
                <div className="mb-5 bg-red-50 border border-red-300 text-red-800 font-semibold px-4 py-3 rounded-xl text-sm">
                  {createError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Make *</label>
                    <input type="text" name="make" value={formData.make} onChange={handleInputChange} required className={inputCls} placeholder="e.g. Toyota" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Model *</label>
                    <input type="text" name="model" value={formData.model} onChange={handleInputChange} required className={inputCls} placeholder="e.g. Camry" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Year *</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className={inputCls} placeholder="e.g. 2023" min="1900" max="2026" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Type *</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className={inputCls}>
                      <option>Sedan</option>
                      <option>SUV</option>
                      <option>Luxury</option>
                      <option>Sports</option>
                      <option>Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Daily Price ($) *</label>
                    <input type="number" name="dailyPrice" value={formData.dailyPrice} onChange={handleInputChange} required className={inputCls} placeholder="0.00" min="1" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Security Deposit ($) *</label>
                    <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} required className={inputCls} placeholder="0.00" min="0" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Seats *</label>
                    <input type="number" name="seats" value={formData.seats} onChange={handleInputChange} required className={inputCls} placeholder="5" min="1" max="50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Transmission</label>
                    <select name="transmission" value={formData.transmission} onChange={handleInputChange} className={inputCls}>
                      <option>Automatic</option>
                      <option>Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Fuel Type</label>
                    <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className={inputCls}>
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                      <option>CNG</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className={inputCls} placeholder="e.g. 123 Main St, Mumbai" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className={inputCls} placeholder="Describe the vehicle…" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Photos (optional)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(e) => setVehicleImages(Array.from(e.target.files || []))}
                      className="w-full text-sm text-gray-700 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {vehicleImages.length > 0 && (
                      <p className="mt-2 text-sm text-green-700 font-semibold">{vehicleImages.length} file(s) selected</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 font-bold rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isCreating} className="px-6 py-3 font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm">
                    {isCreating ? 'Adding…' : 'List Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── EDIT VEHICLE MODAL ── */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Vehicle</h2>
                <button type="button" onClick={() => setEditingVehicle(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              {editError && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm font-semibold">
                  {editError}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Make *</label>
                    <input type="text" name="make" value={formData.make} onChange={handleInputChange} required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Model *</label>
                    <input type="text" name="model" value={formData.model} onChange={handleInputChange} required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Year *</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Daily Price ($) *</label>
                    <input type="number" name="dailyPrice" value={formData.dailyPrice} onChange={handleInputChange} required className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1">Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className={inputCls} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditingVehicle(null)} className="px-6 py-3 rounded-xl font-bold text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isUpdating} className="px-6 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">{isUpdating ? 'Saving…' : 'Save Changes'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default OrganizationDashboard;
