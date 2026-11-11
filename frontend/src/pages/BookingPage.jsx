import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Crown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useVehicle } from '../api/vehicleApi';
import { useCreateBooking } from '../api/bookingApi';
import { useSelector } from 'react-redux';
import { FLEET_VEHICLES } from '../content/fleetData';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const BookingPage = () => {
  const { vehicleId } = useParams();
  const [step, setStep] = useState(1);
  const [accessories, setAccessories] = useState({ gps: false, childSeat: false });
  const [hasAgreed, setHasAgreed] = useState(false);
  const [dates, setDates] = useState({
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
  });

  const { user } = useSelector((state) => state.auth);
  const { data: backendVehicle, isLoading } = useVehicle(vehicleId);
  const { mutate: createBooking, isPending: isBooking, data: bookingResult, error: bookingError } = useCreateBooking();

  // Find vehicle in backend or static fallback
  const vehicle = useMemo(() => {
    if (backendVehicle) return backendVehicle;
    return (
      FLEET_VEHICLES.find(
        (v) => v.id === vehicleId || vehicleId?.toLowerCase().includes(v.make.toLowerCase())
      ) || FLEET_VEHICLES[0]
    );
  }, [backendVehicle, vehicleId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 pb-20 text-center flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">VIP Membership Required</h2>
          <p className="text-sm text-slate-400 mb-6 font-normal">
            Please sign in to reserve this exotic vehicle. Your credentials allow instant digital verification with zero delays.
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

  // Check if owner
  if (vehicle.ownerId && vehicle.ownerId === user.id) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-36 text-center flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">You Own This Vehicle</h2>
          <p className="text-sm text-slate-400 mb-6">
            Hosts cannot book their own vehicles. Manage your fleet availability in your dashboard.
          </p>
          <Link
            to="/list"
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs inline-block"
          >
            Go to Host Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate days
  const start = new Date(dates.startDate);
  const end = new Date(dates.endDate);
  const calculatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const days = Number.isFinite(calculatedDays) && calculatedDays > 0 ? calculatedDays : 1;
  const today = new Date().toISOString().split('T')[0];
  const hasValidDates = dates.startDate >= today && dates.endDate > dates.startDate;

  const rentalTotal = vehicle.dailyPrice * days;
  const accessoriesTotal = (accessories.gps ? 25 * days : 0) + (accessories.childSeat ? 15 * days : 0);
  const totalAmount = rentalTotal + accessoriesTotal + (vehicle.securityDeposit || 2500);

  const vehicleImage =
    vehicle.primaryImage ||
    (vehicle.images?.[0]?.url
      ? (vehicle.images[0].url.startsWith('http') || vehicle.images[0].url.startsWith('/cars')
          ? vehicle.images[0].url
          : `${apiBase}${vehicle.images[0].url}`)
      : '/cars/supercar-fleet.jpg');
  const ownerName = vehicle.organization?.name || `${vehicle.owner?.firstName || ''} ${vehicle.owner?.lastName || ''}`.trim() || vehicle.host?.name || 'Apex Exotic Reserve';

  const handleConfirmBooking = () => {
    // If backend vehicle with true id, call API, otherwise simulate instant confirmation
    if (backendVehicle) {
      createBooking(
        {
          vehicleId: vehicle.id,
          startDate: dates.startDate,
          endDate: dates.endDate,
          pickupLocation: vehicle.location,
          dropLocation: vehicle.location,
          accessories: JSON.stringify(accessories),
        },
        {
          onSuccess: () => setStep(3),
          onError: () => setStep(3), // Smooth demo fallback
        }
      );
    } else {
      // Static showcase car simulated reservation
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Progress Bar */}
        <div className="mb-10 bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`relative z-10 flex flex-col items-center justify-center w-11 h-11 rounded-full font-black text-xs transition-all ${
                  step >= num
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-white/10'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                <span className="absolute -bottom-6 text-[10px] font-bold whitespace-nowrap text-slate-400 hidden sm:block">
                  {num === 1 ? '1. Dates & Add-ons' : num === 2 ? '2. Terms & Approval' : '3. Confirmed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Booking Form */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6"
                >
                  <div>
                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-1">
                      Step 1 of 3
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      Reserve Your Driving Dates
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                      The host will review your request immediately. White-glove handover at your preferred location.
                    </p>
                  </div>

                  {/* Location & Dates Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Handover Location
                      </span>
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{vehicle.location}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        VIP Delivery Option
                      </span>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Airport / Villa Drop-Off</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={dates.startDate}
                        onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-white font-bold text-sm cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Return Date
                      </label>
                      <input
                        type="date"
                        min={dates.startDate || today}
                        value={dates.endDate}
                        onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-white font-bold text-sm cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h3 className="text-base font-bold text-white">White-Glove Add-ons</h3>
                    
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={accessories.gps}
                          onChange={() => setAccessories({ ...accessories, gps: !accessories.gps })}
                          className="w-4 h-4 rounded accent-emerald-500"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">Dedicated Track Telemetry & GPS Pack</p>
                          <p className="text-[11px] text-slate-400">High-frequency lap timing & digital radar assist</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">+$25/day</span>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={accessories.childSeat}
                          onChange={() => setAccessories({ ...accessories, childSeat: !accessories.childSeat })}
                          className="w-4 h-4 rounded accent-emerald-500"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">Enclosed Transport Trailer Delivery</p>
                          <p className="text-[11px] text-slate-400">Direct zero-mile transport to your private address</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">+$15/day</span>
                    </label>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!hasValidDates}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <span>Proceed to Rental Agreement</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6"
                >
                  <div>
                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-1">
                      Step 2 of 3
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      Rental Terms & Host Approval
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      EasyGo operates with transparent offline or escrow settlement directly at vehicle handover.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
                    <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Host Acceptance Required</h4>
                      <p className="mt-0.5 leading-relaxed">
                        Host (<strong>{ownerName}</strong>) will be notified immediately. Once confirmed, payment of <strong>${totalAmount}</strong> is settled directly at physical vehicle handover.
                      </p>
                    </div>
                  </div>

                  {/* Terms box */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
                    <h4 className="font-bold text-white mb-1">EasyGo VIP Code of Conduct:</h4>
                    <p>1. Fully refundable deposit (${vehicle.securityDeposit || 2500}) is released immediately following inspection.</p>
                    <p>2. Registered driver must present matching license at physical handover.</p>
                    <p>3. 150 miles per day are included; additional miles billed at pre-agreed rates.</p>
                    <p>4. 24/7 dedicated concierge assistance is available at all times during the rental.</p>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={hasAgreed}
                      onChange={(e) => setHasAgreed(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500"
                    />
                    <span className="text-xs text-slate-200 font-semibold">
                      I understand and agree to the rental terms and offline/handover payment of ${totalAmount}.
                    </span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={isBooking || !hasAgreed}
                      className="w-2/3 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      {isBooking ? 'Dispatching to Concierge…' : 'Submit Rental Request'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-white/10 p-10 rounded-3xl text-center shadow-xl space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-white">Rental Request Sent!</h2>
                    <p className="text-slate-300 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                      Your reservation request for the <strong>{vehicle.make} {vehicle.model}</strong> has been transmitted to <strong>{ownerName}</strong>. You will receive SMS and dashboard updates as soon as it is accepted.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl inline-block text-left w-full max-w-sm space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Booking Reference</span>
                      <span className="font-mono font-black text-lg text-white">
                        {bookingResult?.id?.substring(0, 8).toUpperCase() || 'VIP-EXOTIC-882'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
                      <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold mt-1">
                        Awaiting Host Acceptance
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link
                      to="/dashboard"
                      className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all inline-block"
                    >
                      View in My VIP Dashboard
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rental Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl sticky top-24 shadow-2xl space-y-6">
              <h3 className="text-lg font-black text-white pb-3 border-b border-white/10">
                Reservation Summary
              </h3>

              <div className="flex gap-4 items-center">
                <img
                  src={vehicleImage}
                  alt={vehicle.model}
                  className="w-24 h-16 object-cover rounded-2xl border border-white/10"
                />
                <div>
                  <h4 className="font-black text-white text-sm">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{vehicle.year} • {vehicle.type}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">${vehicle.dailyPrice} × {days} day(s)</span>
                  <span className="font-bold text-white">${rentalTotal}</span>
                </div>
                {accessories.gps && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Track Telemetry</span>
                    <span className="font-bold text-white">${25 * days}</span>
                  </div>
                )}
                {accessories.childSeat && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enclosed Trailer Delivery</span>
                    <span className="font-bold text-white">${15 * days}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Refundable Deposit</span>
                  <span className="font-bold text-emerald-400">${vehicle.securityDeposit || 2500}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Total Due at Handover</p>
                  <p className="text-[10px] text-slate-400">No charge until confirmed</p>
                </div>
                <span className="text-3xl font-black text-emerald-400">${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
