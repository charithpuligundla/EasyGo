import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Car, Users, TrendingUp, Calendar, Plus,
  MoreVertical, Edit, Trash2, CheckCircle, X, MessageSquare,
  ShieldCheck, AlertCircle, Clock, MapPin, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useVehicles, useCreateVehicle, useDeleteVehicle, useUpdateVehicle } from '../api/vehicleApi';
import { useMyOrganizations, useCreateOrganization } from '../api/orgApi';
import { useOwnerBookings, useUpdateBooking } from '../api/bookingApi';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'fleet', label: 'Fleet Management', icon: <Car className="w-5 h-5" /> },
  { id: 'bookings', label: 'Bookings & Chat', icon: <Calendar className="w-5 h-5" /> },
  { id: 'organization', label: 'Organization', icon: <Building2 className="w-5 h-5" /> },
  { id: 'employees', label: 'Employees', icon: <Users className="w-5 h-5" /> },
];

const inputCls = 'w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-950 text-white font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-500 text-sm';

const VEHICLE_TYPES = [
  'Cars & Supercars',
  'SUVs & 4x4',
  'Motorcycles & Superbikes',
  'Watercraft & Jet Skis',
  'Vans & Luxury Sprinters',
  'Electric Scooters & E-Bikes',
  'Commercial & Heavy Trucks',
];

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('fleet');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [createError, setCreateError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    make: '', model: '', year: '', type: 'Cars & Supercars', description: '',
    dailyPrice: '', securityDeposit: '', location: '', seats: '2',
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
    setSuccessMsg('');
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    vehicleImages.forEach((file) => data.append('vehicleImages', file));

    createVehicle(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setFormData(emptyForm);
        setVehicleImages([]);
        setSuccessMsg('Vehicle listed successfully! It is now live in the EasyGo marketplace.');
        setTimeout(() => setSuccessMsg(''), 6000);
      },
      onError: (err) => {
        setCreateError(err?.response?.data?.message || err?.message || 'Failed to add vehicle. Check all fields.');
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
      location: vehicle.location, seats: String(vehicle.seats || 2),
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
          setEditError(err?.response?.data?.message || 'Failed to update vehicle details.');
        },
      }
    );
  };

  const handleDeleteVehicle = (vehicle) => {
    if (window.confirm(`Are you sure you want to remove "${vehicle.make} ${vehicle.model}" from your listed fleet?`)) {
      deleteVehicle(vehicle.id);
    }
  };

  const handleBookingStatus = (bookingId, status) => {
    updateBooking({ id: bookingId, updateData: { status } });
  };

  const handleMarkPaid = (bookingId) => {
    if (window.confirm('Confirm that you have received payment for this booking?')) {
      updateBooking({ id: bookingId, updateData: { paymentStatus: 'PAID_OFFLINE' } });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 pb-20 text-center flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <Building2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Host Access Required</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please log in or register to access the Host & Fleet Dashboard and list your vehicles.
          </p>
          <Link
            to="/login"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm inline-block shadow-lg shadow-emerald-500/25 transition-all"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Vehicle Host Management</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Host & Fleet Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              List cars, superbikes, watercraft, luxury sprinters, and chat directly with buyers.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Add New Vehicle
            </button>
            <Link
              to="/messages"
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0"
              title="Chat with buyers"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Messages</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Nav */}
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

          {/* Main Content Area */}
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
                
                {/* ── FLEET MANAGEMENT TAB ── */}
                {activeTab === 'fleet' && (
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-xl font-black text-white">Your Listed Fleet ({fleet?.length || 0})</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Manage cars, superbikes, watercraft, and vans in your catalog.</p>
                      </div>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/25"
                      >
                        <Plus className="w-4 h-4" /> Add Vehicle
                      </button>
                    </div>

                    {successMsg && (
                      <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-3 font-bold">Vehicle</th>
                            <th className="py-3 px-3 font-bold">Category Type</th>
                            <th className="py-3 px-3 font-bold">Location</th>
                            <th className="py-3 px-3 font-bold">Daily Rate</th>
                            <th className="py-3 px-3 font-bold">Status</th>
                            <th className="py-3 px-3 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {isLoading && <tr><td colSpan="6" className="text-center py-12 text-slate-400">Loading your fleet…</td></tr>}
                          {fleet && fleet.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-16 text-slate-400">
                                <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="font-bold text-white text-sm">No vehicles listed yet</p>
                                <p className="text-xs text-slate-400 mt-1 mb-4">Add your cars, bikes, vans or watercraft to begin receiving rental requests.</p>
                                <button
                                  onClick={() => setIsAddModalOpen(true)}
                                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                                >
                                  + List First Vehicle
                                </button>
                              </td>
                            </tr>
                          )}
                          {fleet && fleet.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-4 px-3 font-bold text-white">
                                <div className="flex items-center gap-3">
                                  {vehicle.images?.[0]?.url ? (
                                    <img
                                      src={vehicle.images[0].url.startsWith('http') || vehicle.images[0].url.startsWith('/cars') ? vehicle.images[0].url : `${apiBase}${vehicle.images[0].url}`}
                                      alt={vehicle.model}
                                      className="w-12 h-9 object-cover rounded-xl border border-white/10 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                      <Car className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="block text-white font-bold">{vehicle.make} {vehicle.model}</span>
                                    <span className="text-[10px] text-slate-400">{vehicle.year}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-3 font-semibold text-emerald-400">{vehicle.type}</td>
                              <td className="py-4 px-3 text-slate-300">{vehicle.location}</td>
                              <td className="py-4 px-3 font-black text-white">${vehicle.dailyPrice}</td>
                              <td className="py-4 px-3">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  {vehicle.status || 'AVAILABLE'}
                                </span>
                              </td>
                              <td className="py-4 px-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(vehicle)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                                    title="Edit details"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVehicle(vehicle)}
                                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                    title="Remove vehicle"
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
                  </div>
                )}

                {/* ── BOOKINGS & CHAT TAB ── */}
                {activeTab === 'bookings' && (
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-xl font-black text-white">Incoming Rental Requests</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Accept, decline, and chat directly with buyers regarding handovers.</p>
                      </div>
                      <Link
                        to="/messages"
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> All Buyer Messages
                      </Link>
                    </div>

                    {areBookingsLoading ? (
                      <p className="text-slate-400 text-xs py-12 text-center">Loading booking requests…</p>
                    ) : bookings?.length ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border border-white/10 rounded-2xl p-5 bg-slate-950/60 hover:border-emerald-500/40 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-bold text-white text-base">{booking.vehicle.make} {booking.vehicle.model}</h3>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    booking.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                    booking.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                    booking.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/10 text-slate-300'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-300">
                                  Buyer: <strong className="text-white">{booking.customer.firstName} {booking.customer.lastName}</strong> ({booking.customer.email})
                                </p>
                                <p className="text-xs text-slate-400">
                                  Rental Period: <span className="text-white font-semibold">{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</span>
                                </p>
                                <p className="text-xs text-emerald-400 font-bold">
                                  Total to Collect: ${booking.totalAmount} (Includes ${booking.securityDeposit} deposit)
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  to={`/messages/${booking.id}`}
                                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Chat with Buyer</span>
                                </Link>

                                {booking.status === 'PENDING' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleBookingStatus(booking.id, 'APPROVED')}
                                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleBookingStatus(booking.id, 'REJECTED')}
                                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}

                                {booking.status === 'APPROVED' && (
                                  <button
                                    type="button"
                                    onClick={() => handleBookingStatus(booking.id, 'ACTIVE')}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                                  >
                                    Handover Vehicle
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No booking requests currently pending.
                      </div>
                    )}
                  </div>
                )}

                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-6">Fleet Summary</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Listed Fleet</p>
                        <p className="text-3xl font-black text-white mt-1">{fleet?.length || 0}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Total Bookings</p>
                        <p className="text-3xl font-black text-white mt-1">{bookings?.length || 0}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">Pending Review</p>
                        <p className="text-3xl font-black text-white mt-1">{(bookings || []).filter((b) => b.status === 'PENDING').length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ORGANIZATION TAB ── */}
                {activeTab === 'organization' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-6">Organization Profile</h2>
                    <form onSubmit={handleOrgSubmit} className="space-y-4 max-w-lg">
                      {orgError && <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl">{orgError}</p>}
                      {orgSuccess && <p className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl">{orgSuccess}</p>}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Organization / Fleet Name</label>
                        <input type="text" name="name" value={orgFormData.name} onChange={handleOrgInputChange} required className={inputCls} placeholder="e.g. Monaco Luxury Fleet LLC" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Business Registration (Optional)</label>
                        <input type="text" name="businessRegNo" value={orgFormData.businessRegNo} onChange={handleOrgInputChange} className={inputCls} placeholder="BRN-99882" />
                      </div>
                      <button type="submit" disabled={isOrgCreating} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs">
                        {isOrgCreating ? 'Saving…' : 'Save Organization'}
                      </button>
                    </form>
                  </div>
                )}

                {/* ── EMPLOYEES TAB ── */}
                {activeTab === 'employees' && (
                  <div>
                    <h2 className="text-xl font-black text-white mb-4">Team & Drivers</h2>
                    <p className="text-xs text-slate-400">Manage drivers, concierge representatives, and technicians.</p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── ADD / EDIT VEHICLE MODAL (MULTI-VEHICLE SUPPORT) ── */}
      {(isAddModalOpen || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingVehicle ? 'Edit Vehicle Details' : 'List a New Rental Vehicle'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose category: Cars, Superbikes, Watercraft, Vans, or Scooters.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingVehicle(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(createError || editError) && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold p-3 rounded-xl">
                {createError || editError}
              </div>
            )}

            <form onSubmit={editingVehicle ? handleEditSubmit : handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Make / Brand *</label>
                  <input type="text" name="make" value={formData.make} onChange={handleInputChange} required className={inputCls} placeholder="e.g. Ferrari / Ducati / Sea-Doo" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Model *</label>
                  <input type="text" name="model" value={formData.model} onChange={handleInputChange} required className={inputCls} placeholder="e.g. 12Cilindri / Panigale V4 / RXT-X" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Year *</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className={inputCls} placeholder="2024" min="1950" max="2035" />
                </div>
                
                {/* DIVERSE VEHICLE TYPE SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">Vehicle Type / Category *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className={inputCls}>
                    {VEHICLE_TYPES.map((vType) => (
                      <option key={vType} value={vType} className="bg-slate-900 text-white">
                        {vType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Daily Price ($) *</label>
                  <input type="number" name="dailyPrice" value={formData.dailyPrice} onChange={handleInputChange} required className={inputCls} placeholder="350" min="1" step="0.01" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Security Deposit ($) *</label>
                  <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} required className={inputCls} placeholder="1000" min="0" step="0.01" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Seating / Capacity *</label>
                  <input type="number" name="seats" value={formData.seats} onChange={handleInputChange} required className={inputCls} placeholder="2" min="1" max="50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange} className={inputCls}>
                    <option className="bg-slate-900">Automatic</option>
                    <option className="bg-slate-900">Manual</option>
                    <option className="bg-slate-900">Dual-Clutch (DCT)</option>
                    <option className="bg-slate-900">Single-Speed Direct Drive</option>
                    <option className="bg-slate-900">Watercraft Jet Propulsion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fuel / Powertrain</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className={inputCls}>
                    <option className="bg-slate-900">Petrol</option>
                    <option className="bg-slate-900">Electric</option>
                    <option className="bg-slate-900">Hybrid</option>
                    <option className="bg-slate-900">Diesel</option>
                    <option className="bg-slate-900">Marine High-Octane</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Location / Marina / City *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className={inputCls} placeholder="e.g. Beverly Hills, CA" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Description & Inclusions</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className={inputCls} placeholder="Describe vehicle condition, power, pickup instructions…" />
                </div>
                {!editingVehicle && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Upload Photos</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setVehicleImages(Array.from(e.target.files || []))}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingVehicle(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25"
                >
                  {isCreating || isUpdating ? 'Saving Vehicle…' : editingVehicle ? 'Update Vehicle' : 'List Vehicle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboard;
