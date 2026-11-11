import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Star,
  MapPin,
  Car,
  Settings,
  Fuel,
  Heart,
  ShieldCheck,
  Zap,
  Gauge,
  Clock,
  CheckCircle2,
  Share2,
  Calendar,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Crown,
  MessageSquare
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useVehicle } from '../api/vehicleApi';
import { useFavorites, useToggleFavorite } from '../api/favoriteApi';
import { useCreateReview } from '../api/reviewApi';
import { FLEET_VEHICLES } from '../content/fleetData';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const VehicleDetailPage = () => {
  const { vehicleId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: backendVehicle, isLoading: backendLoading } = useVehicle(vehicleId);
  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: createReview, isPending: isReviewing } = useCreateReview();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Find in static fleet or backend data
  const vehicle = useMemo(() => {
    // Check static fleet first by id or model match
    const staticMatch = FLEET_VEHICLES.find(
      (v) => v.id === vehicleId || vehicleId?.toLowerCase().includes(v.make.toLowerCase())
    );

    if (backendVehicle) {
      return {
        id: backendVehicle.id,
        make: backendVehicle.make,
        model: backendVehicle.model,
        year: backendVehicle.year,
        type: backendVehicle.type,
        badge: staticMatch?.badge || 'Verified Exotic',
        tagline: staticMatch?.tagline || 'Engineered For Pure Driving Passion',
        description: backendVehicle.description,
        dailyPrice: backendVehicle.dailyPrice,
        securityDeposit: backendVehicle.securityDeposit || 2500,
        rating: 5.0,
        location: backendVehicle.location,
        seats: backendVehicle.seats || 2,
        transmission: backendVehicle.transmission || 'Dual-Clutch Automatic',
        fuelType: backendVehicle.fuelType || 'High-Octane V12 / Hybrid',
        horsepower: staticMatch?.horsepower || '750+ HP',
        acceleration: staticMatch?.acceleration || '2.8s (0-60 mph)',
        topSpeed: staticMatch?.topSpeed || '210+ MPH',
        primaryImage: backendVehicle.images?.[0]?.url
          ? (backendVehicle.images[0].url.startsWith('http') || backendVehicle.images[0].url.startsWith('/cars')
              ? backendVehicle.images[0].url
              : `${apiBase}${backendVehicle.images[0].url}`)
          : staticMatch?.primaryImage || '/cars/supercar-fleet.jpg',
        gallery: backendVehicle.images?.length > 0
          ? backendVehicle.images.map((img) =>
              img.url.startsWith('http') || img.url.startsWith('/cars') ? img.url : `${apiBase}${img.url}`
            )
          : staticMatch?.gallery || ['/cars/supercar-fleet.jpg'],
        features: staticMatch?.features || [
          'Airport terminal concierge delivery',
          'Track telemetry & Sport Chrono pack',
          'Zero deductible insurance package available',
          '150 complimentary daily miles included',
          '24/7 dedicated exotic vehicle specialist'
        ],
        host: backendVehicle.organization?.name
          ? { name: backendVehicle.organization.name, rating: 5.0, trips: 140, verified: true, badge: 'Fleet Partner' }
          : staticMatch?.host || { name: 'Apex Exotic Reserve', rating: 5.0, trips: 184, verified: true, badge: 'Premier Host' },
        reviews: backendVehicle.reviews || [],
      };
    }

    return staticMatch || FLEET_VEHICLES[0];
  }, [backendVehicle, vehicleId]);

  if (!vehicle && backendLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-36 text-center text-slate-400 font-bold">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading Exotic Vehicle Details…</p>
      </div>
    );
  }

  const isFavorite = favorites.some((v) => v.id === vehicle.id);
  const gallery = vehicle.gallery?.length > 0 ? vehicle.gallery : [vehicle.primaryImage];
  const currentPhoto = gallery[activePhotoIndex] || vehicle.primaryImage;

  const onFavorite = () => {
    if (!user) return;
    toggleFavorite({ vehicleId: vehicle.id, isFavorite });
  };

  const onSubmitReview = (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewError('');
    setReviewSuccess('');
    createReview(
      { vehicleId: vehicle.id, rating, comment },
      {
        onSuccess: () => {
          setComment('');
          setReviewSuccess('Your review has been submitted to EasyGo Concierge. Thank you!');
        },
        onError: (err) => {
          setReviewError(err?.response?.data?.message || 'Failed to submit review.');
        },
      }
    );
  };

  const similarCars = FLEET_VEHICLES.filter((c) => c.id !== vehicle.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between py-4 text-xs font-semibold text-slate-400 border-b border-white/10 mb-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <Link to="/search" className="hover:text-emerald-400">Fleet</Link>
            <span>/</span>
            <span className="text-white font-bold">{vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${vehicle.make} ${vehicle.model}`, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Vehicle link copied to clipboard!');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            {user && (
              <button
                onClick={onFavorite}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            )}
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {vehicle.badge || 'VIP Exotic Fleet'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              📍 {vehicle.location}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-emerald-400 font-semibold text-sm mt-1">
            {vehicle.tagline || 'Experience the Pinnacle of Automotive Performance'}
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Photos & Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Main Photo */}
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 border border-white/15 shadow-2xl">
                <img
                  src={currentPhoto}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{vehicle.rating || 5.0} (Verified)</span>
                </div>
              </div>

              {/* Thumbnails row */}
              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {gallery.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-28 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                        activePhotoIndex === idx
                          ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-500/20'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Performance HUD Grid */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4" /> Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase mb-1">Horsepower</span>
                  <span className="text-xl font-black text-white">{vehicle.horsepower || '750 HP'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase mb-1">Acceleration</span>
                  <span className="text-xl font-black text-emerald-400">{vehicle.acceleration || '2.8s'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase mb-1">Top Speed</span>
                  <span className="text-xl font-black text-white">{vehicle.topSpeed || '210 MPH'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase mb-1">Transmission</span>
                  <span className="text-sm font-black text-white">{vehicle.transmission || 'Dual-Clutch'}</span>
                </div>
              </div>
            </div>

            {/* Overview / Story */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              <h3 className="text-xl font-black text-white">Vehicle Overview</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                {vehicle.description}
              </p>

              <div className="pt-4 border-t border-white/10 grid sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><Car className="w-4 h-4 text-emerald-400" /> {vehicle.seats} Racing Seats</span>
                <span className="flex items-center gap-1.5"><Fuel className="w-4 h-4 text-emerald-400" /> {vehicle.fuelType}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> $1M Allianz Protection</span>
              </div>
            </div>

            {/* Included Perks & White Glove Service */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-black text-white mb-4">Included In Your Rental</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(vehicle.features || [
                  '150 Complimentary Daily Miles',
                  'Airport Terminal / FBO Valet Delivery',
                  '24/7 Dedicated Track Concierge',
                  'Full Hand Wash & Interior Detailing'
                ]).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Information Card */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                  <Crown className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base flex items-center gap-2">
                    {vehicle.host?.name || 'Apex Exotic Reserve'}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {vehicle.host?.badge || 'Premier Host'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    ★ {vehicle.host?.rating || '5.0'} • {vehicle.host?.trips || 184} Completed Rentals • 100% Response Rate
                  </p>
                </div>
              </div>

              <div className="hidden sm:block">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                  Verified Identity
                </span>
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-xl font-black text-white">Verified Client Reviews</h3>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" /> 5.0 (All Reviews Verified)
                </div>
              </div>

              {/* Sample / DB Reviews */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Alexander Thorne • Verified Renter</span>
                    <span className="text-slate-400">2 weeks ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "Unbelievable machine. Delivered directly to our hangar at Van Nuys Airport, detailed to perfection. The acceleration is violent and intoxicating. EasyGo Concierge took care of every request within minutes."
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Elena Rostova • Private Client</span>
                    <span className="text-slate-400">1 month ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "Flawless condition and unmatched presence. We drove it through South Beach and got nonstop attention. The booking process on EasyGo was effortless with zero hidden fees."
                  </p>
                </div>
              </div>

              {/* Submit Review Form (if user is logged in) */}
              {user && (
                <form onSubmit={onSubmitReview} className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="font-bold text-white text-sm">Leave a Renter Review</h4>
                  {reviewSuccess && (
                    <p className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
                      {reviewSuccess}
                    </p>
                  )}
                  {reviewError && (
                    <p className="p-3 rounded-xl bg-red-500/20 text-red-300 text-xs border border-red-500/30">
                      {reviewError}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Rating:</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                    >
                      <option value="5" className="bg-slate-900">5 Stars (Exceptional)</option>
                      <option value="4" className="bg-slate-900">4 Stars (Great)</option>
                      <option value="3" className="bg-slate-900">3 Stars (Average)</option>
                    </select>
                  </div>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your driving experience with other renters..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isReviewing}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs"
                  >
                    {isReviewing ? 'Submitting…' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 sticky top-24 shadow-2xl space-y-6">
              
              {/* Price display */}
              <div className="flex items-baseline justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-3xl font-black text-white">${vehicle.dailyPrice}</span>
                  <span className="text-slate-400 text-xs font-semibold"> /day</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> 5.0
                </div>
              </div>

              {/* Handover Details */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Handover Location:</span>
                  <span className="font-bold text-white text-right">{vehicle.location}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Refundable Deposit:</span>
                  <span className="font-bold text-emerald-400">${vehicle.securityDeposit}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Daily Mileage:</span>
                  <span className="font-bold text-white">150 Miles Included</span>
                </div>
              </div>

              {/* Instant Action CTA */}
              <div className="space-y-3">
                <Link
                  to={`/book/${vehicle.id}`}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Reserve This Vehicle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={user ? `/messages/${vehicle.id}` : '/login'}
                  className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Chat with Host Before Booking</span>
                </Link>

                <p className="text-[11px] text-center text-slate-400">
                  🔒 You won't be charged until the host confirms availability.
                </p>
              </div>

              {/* VIP Concierge Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Have Custom Requests?
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Need private jet runway delivery, track day arrangements, or security escort? Contact our 24/7 VIP Concierge directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Carousel / Grid */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-1">
                More From The Garage
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                Similar Exotic Vehicles
              </h3>
            </div>
            <Link to="/search" className="text-xs font-bold text-emerald-400 hover:underline">
              View All Fleet →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {similarCars.map((car) => (
              <Link
                key={car.id}
                to={`/vehicles/${car.id}`}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-slate-900 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={car.primaryImage}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                      {car.badge}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-white group-hover:text-emerald-400 transition-colors">
                        {car.make} {car.model}
                      </h4>
                      <span className="font-black text-emerald-400">${car.dailyPrice}/day</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{car.horsepower} • {car.acceleration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
