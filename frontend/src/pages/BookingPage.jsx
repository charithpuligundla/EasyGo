import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ChevronRight, Info, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useVehicle } from '../api/vehicleApi';
import { useCreateBooking } from '../api/bookingApi';
import { useSelector } from 'react-redux';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const BookingPage = () => {
  const { vehicleId } = useParams();
  const [step, setStep] = useState(1);
  const [accessories, setAccessories] = useState({ gps: false, childSeat: false });
  const [hasAgreed, setHasAgreed] = useState(false);
  const [dates, setDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  const { user } = useSelector((state) => state.auth);
  
  const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);
  const { mutate: createBooking, isPending: isBooking, data: bookingResult, error: bookingError } = useCreateBooking();

  if (isLoading) return <div className="min-h-screen pt-32 text-center text-gray-700 font-bold">Loading vehicle details...</div>;
  if (isError || !vehicle) return <div className="min-h-screen pt-32 text-center text-red-600 font-bold">Failed to load vehicle.</div>;

  if (!user) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-800">
        <p className="text-xl font-bold mb-4">Please log in to request a vehicle rental.</p>
        <Link to="/login" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold inline-block shadow-md">
          Sign In / Register
        </Link>
      </div>
    );
  }

  // Check if current user is the owner of this vehicle
  if (vehicle.ownerId === user.id) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-800">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You Own This Vehicle</h2>
          <p className="text-gray-700 font-medium mb-6">
            Hosts cannot book their own vehicles. You can manage this listing in your host dashboard.
          </p>
          <Link to="/list" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold inline-block">
            Go to Fleet Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate days and totals
  const start = new Date(dates.startDate);
  const end = new Date(dates.endDate);
  const calculatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const days = Number.isFinite(calculatedDays) && calculatedDays > 0 ? calculatedDays : 1;
  const today = new Date().toISOString().split('T')[0];
  const hasValidDates = dates.startDate >= today && dates.endDate > dates.startDate;
  
  const rentalTotal = vehicle.dailyPrice * days;
  const accessoriesTotal = (accessories.gps ? 15 * days : 0) + (accessories.childSeat ? 10 * days : 0);
  const totalAmount = rentalTotal + accessoriesTotal + vehicle.securityDeposit;
  
  const vehicleImage = vehicle.images?.[0]?.url ? `${apiBase}${vehicle.images[0].url}` : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600';
  const ownerName = vehicle.organization?.name || `${vehicle.owner?.firstName || ''} ${vehicle.owner?.lastName || ''}`.trim() || 'Verified host';

  const handleConfirmBooking = () => {
    createBooking({
      vehicleId: vehicle.id,
      startDate: dates.startDate,
      endDate: dates.endDate,
      pickupLocation: vehicle.location,
      dropLocation: vehicle.location,
      accessories: JSON.stringify(accessories)
    }, {
      onSuccess: () => {
        setStep(3);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Progress Bar */}
        <div className="mb-10 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 z-0 transition-all duration-500" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`relative z-10 flex flex-col items-center justify-center w-12 h-12 rounded-full font-bold ${
                step >= num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              } transition-colors duration-300 shadow-md`}>
                {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
                <span className="absolute -bottom-7 text-xs font-bold whitespace-nowrap text-gray-800 hidden md:block">
                  {num === 1 ? '1. Select Dates' : num === 2 ? '2. Terms & Owner Approval' : '3. Status'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Rental Dates</h2>
                    <p className="text-gray-600 font-medium mb-6">
                      Select your travel dates. The vehicle owner will review and accept your request.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Pickup Location</label>
                        <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <MapPin className="w-5 h-5 text-primary-600 mr-3 shrink-0" />
                          <span className="text-gray-900 font-semibold">{vehicle.location || 'Not Specified'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Return Location</label>
                        <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <MapPin className="w-5 h-5 text-primary-600 mr-3 shrink-0" />
                          <span className="text-gray-900 font-semibold">{vehicle.location || 'Not Specified'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Pickup Date</label>
                        <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <Calendar className="w-5 h-5 text-primary-600 mx-2 shrink-0" />
                          <input 
                            type="date" 
                            className="bg-transparent border-none outline-none text-gray-900 font-semibold w-full"
                            value={dates.startDate}
                            min={today}
                            onChange={(e) => setDates({...dates, startDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Return Date</label>
                        <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <Calendar className="w-5 h-5 text-primary-600 mx-2 shrink-0" />
                          <input 
                            type="date" 
                            className="bg-transparent border-none outline-none text-gray-900 font-semibold w-full"
                            value={dates.endDate}
                            min={dates.startDate || today}
                            onChange={(e) => setDates({...dates, endDate: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">Optional Add-ons</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={accessories.gps} onChange={() => setAccessories({...accessories, gps: !accessories.gps})} className="w-5 h-5 text-primary-600 rounded" />
                          <div>
                            <p className="font-bold text-gray-900">GPS Navigation</p>
                            <p className="text-sm text-gray-600 font-medium">Built-in premium satellite navigation</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">+$15/day</span>
                      </label>
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={accessories.childSeat} onChange={() => setAccessories({...accessories, childSeat: !accessories.childSeat})} className="w-5 h-5 text-primary-600 rounded" />
                          <div>
                            <p className="font-bold text-gray-900">Child Safety Seat</p>
                            <p className="text-sm text-gray-600 font-medium">Safe and comfortable for toddlers</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">+$10/day</span>
                      </label>
                    </div>

                    <button 
                      onClick={() => setStep(2)} 
                      disabled={!hasValidDates}
                      className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Owner Agreement <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">How EasyGo Rental Requests Work</h2>
                    <p className="text-gray-600 font-medium mb-6">Review the approval workflow and rental agreement terms.</p>
                    
                    {/* Owner approval explanation banner */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-6 flex gap-4 items-start">
                      <Clock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900 text-base">Owner Acceptance Required</h4>
                        <p className="text-sm text-blue-800 font-medium mt-1">
                          When you submit this request, the vehicle owner (<strong>{ownerName}</strong>) will be notified immediately. Once the owner accepts your request, your booking is confirmed, and you will pay <strong>${totalAmount}</strong> directly to the owner at vehicle pickup.
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6 flex gap-4 items-start">
                      <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-base">Offline Hand-to-Hand Payment</h4>
                        <p className="text-sm text-amber-800 font-medium mt-1">
                          No online credit card charge is made right now. Total payment of <strong>${totalAmount}</strong> (rental charges of ${rentalTotal + accessoriesTotal} + refundable deposit of ${vehicle.securityDeposit}) will be settled in cash or direct transfer at pickup.
                        </p>
                      </div>
                    </div>

                    <div className="max-w-none text-sm text-gray-700 mb-6 border border-gray-200 p-5 rounded-2xl bg-gray-50 h-52 overflow-y-auto space-y-2">
                      <h4 className="font-bold text-gray-900 text-base mb-2">Rental Agreement Terms</h4>
                      <p>1. The refundable security deposit (${vehicle.securityDeposit}) is returned upon returning the vehicle in good condition.</p>
                      <p>2. Payment must be completed during the physical vehicle handoff.</p>
                      <p>3. The driver must hold a valid driver's license matching the registered profile.</p>
                      <p>4. Fuel level must be returned at the same level as pickup.</p>
                      <p>5. If the owner declines the request, you will be notified immediately and no fees will be incurred.</p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer mb-8">
                      <input
                        type="checkbox"
                        checked={hasAgreed}
                        onChange={(event) => setHasAgreed(event.target.checked)}
                        className="w-5 h-5 text-primary-600 rounded"
                      />
                      <span className="text-gray-800 font-semibold">
                        I understand that the owner must accept this request, and payment of ${totalAmount} will be paid offline at pickup.
                      </span>
                    </label>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-all">
                        Back
                      </button>
                      <button 
                        onClick={handleConfirmBooking}
                        disabled={isBooking || !hasAgreed || !hasValidDates}
                        className="w-2/3 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-50"
                      >
                        {isBooking ? 'Sending Request…' : 'Submit Rental Request to Owner'}
                      </button>
                    </div>
                    {bookingError && (
                      <p className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 font-semibold" role="alert">
                        {bookingError.response?.data?.message || 'We could not submit this booking. Please check the dates and try again.'}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 p-10 rounded-3xl text-center shadow-sm"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Rental Request Sent!</h2>
                  <p className="text-gray-700 font-medium mb-6 max-w-md mx-auto">
                    Your request for the <strong>{vehicle.make} {vehicle.model}</strong> has been sent to <strong>{ownerName}</strong>. You will receive an update once they review and accept it.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-8 inline-block text-left w-full max-w-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Booking Reference</p>
                    <p className="font-mono font-bold text-xl text-gray-900 mb-4">{bookingResult?.id?.substring(0,8) || 'BK-PENDING'}</p>
                    
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Current Status</p>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                      Awaiting Owner Acceptance
                    </span>
                  </div>

                  <div>
                    <Link to="/dashboard" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all inline-block">
                      View in My Dashboard
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 p-6 rounded-3xl sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Rental Summary</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <img src={vehicleImage} alt={vehicle.model} className="w-24 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-gray-900">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-sm text-gray-600 font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-4 h-4 text-primary-600" /> Host: {ownerName}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>${vehicle.dailyPrice} × {days} day(s)</span>
                  <span className="font-bold text-gray-900">${rentalTotal}</span>
                </div>
                {accessories.gps && (
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>GPS Navigation</span>
                    <span className="font-bold text-gray-900">${15 * days}</span>
                  </div>
                )}
                {accessories.childSeat && (
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>Child Safety Seat</span>
                    <span className="font-bold text-gray-900">${10 * days}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-bold text-gray-900">${vehicle.securityDeposit}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-base font-bold text-gray-900">Total Amount</p>
                  <p className="text-xs text-gray-500 font-semibold">Pay offline at pickup</p>
                </div>
                <span className="text-3xl font-extrabold text-primary-700">${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;
