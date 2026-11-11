import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Filter,
  Star,
  Car,
  Settings,
  Fuel,
  Heart,
  Calendar,
  Sparkles,
  Zap,
  Gauge,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useVehicles } from '../api/vehicleApi';
import { useFavorites, useToggleFavorite } from '../api/favoriteApi';
import { FLEET_VEHICLES, FLEET_CATEGORIES } from '../content/fleetData';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CITIES = [
  'All Locations',
  'Beverly Hills, CA',
  'Miami Beach, FL',
  'Las Vegas, NV',
  'San Francisco, CA',
  'New York, NY',
  'Scottsdale, AZ',
  'Los Angeles, CA'
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterType, setFilterType] = useState(searchParams.get('type') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [priceMax, setPriceMax] = useState(5000);
  const [sort, setSort] = useState('recommended');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');

  const { user } = useSelector((state) => state.auth);
  const { data: backendVehicles, isLoading } = useVehicles({
    ...(filterType && { type: filterType }),
    ...(location.trim() && location !== 'All Locations' && { location: location.trim() }),
    priceMax,
    sort,
  });

  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const favoriteIds = new Set(favorites.map((v) => v.id));

  // Merge backend vehicles with static showcase fleet so the catalog is always rich & attractive
  const allVehicles = useMemo(() => {
    let combined = [];

    // If backend returns vehicles, format them
    if (backendVehicles && backendVehicles.length > 0) {
      combined = backendVehicles.map((bv) => ({
        id: bv.id,
        make: bv.make,
        model: bv.model,
        year: bv.year,
        type: bv.type || 'Cars & Supercars',
        vehicleCategory: bv.type || 'Verified Vehicle',
        badge: bv.type?.includes('Electric') ? 'Hyper-EV' : bv.type?.includes('Motorcycle') ? 'Superbike' : 'Verified Listing',
        tagline: bv.description?.slice(0, 50) || 'Verified Rental Machine',
        description: bv.description,
        dailyPrice: bv.dailyPrice,
        securityDeposit: bv.securityDeposit,
        rating: 5.0,
        reviewCount: bv.reviews?.length || 18,
        location: bv.location,
        seats: bv.seats || 2,
        transmission: bv.transmission || 'Automatic',
        fuelType: bv.fuelType || 'Petrol / Electric',
        horsepower: 'Available',
        acceleration: 'High Performance',
        topSpeed: 'Verified',
        primaryImage: bv.images?.[0]?.url
          ? (bv.images[0].url.startsWith('http') || bv.images[0].url.startsWith('/cars') ? bv.images[0].url : `${apiBase}${bv.images[0].url}`)
          : '/cars/supercar-fleet.jpg',
      }));
    }

    // Include FLEET_VEHICLES if not already present by make+model
    for (const fv of FLEET_VEHICLES) {
      const alreadyHas = combined.some(
        (c) => c.make.toLowerCase() === fv.make.toLowerCase() && c.model.toLowerCase().includes(fv.model.split(' ')[0].toLowerCase())
      );
      if (!alreadyHas) {
        combined.push(fv);
      }
    }

    // Apply Client Filters
    return combined.filter((vehicle) => {
      if (filterType && filterType !== 'all') {
        const matchesType =
          vehicle.type?.toLowerCase().includes(filterType.toLowerCase()) ||
          vehicle.vehicleCategory?.toLowerCase().includes(filterType.toLowerCase()) ||
          filterType.toLowerCase().includes(vehicle.type?.toLowerCase() || '');
        if (!matchesType) return false;
      }
      if (location && location !== 'All Locations') {
        const locLower = location.toLowerCase();
        if (!vehicle.location?.toLowerCase().includes(locLower.split(',')[0].trim().toLowerCase())) {
          return false;
        }
      }
      if (priceMax && vehicle.dailyPrice > priceMax) {
        return false;
      }
      if (transmissionFilter && !vehicle.transmission?.toLowerCase().includes(transmissionFilter.toLowerCase())) {
        return false;
      }
      if (fuelFilter && !vehicle.fuelType?.toLowerCase().includes(fuelFilter.toLowerCase())) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sort === 'priceAsc') return a.dailyPrice - b.dailyPrice;
      if (sort === 'priceDesc') return b.dailyPrice - a.dailyPrice;
      if (sort === 'powerDesc') {
        const hpA = parseInt(a.horsepower) || 0;
        const hpB = parseInt(b.horsepower) || 0;
        return hpB - hpA;
      }
      return 0; // recommended order
    });
  }, [backendVehicles, filterType, location, priceMax, transmissionFilter, fuelFilter, sort]);

  const handleResetFilters = () => {
    setFilterType('');
    setLocation('');
    setPriceMax(5000);
    setTransmissionFilter('');
    setFuelFilter('');
    setSort('recommended');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Title & Intro */}
        <div className="mb-8">
          <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-2">
            The Multi-Vehicle Rental Marketplace
          </span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Browse Vehicles
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {allVehicles.length} Vehicles Available Across All Categories
            </p>
          </div>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-slate-900 border border-white/15 rounded-3xl p-4 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Location selector */}
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-2xl border border-white/5">
              <MapPin className="text-emerald-400 w-5 h-5 shrink-0" />
              <div className="w-full">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Handover City</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-semibold text-xs cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c === 'All Locations' ? '' : c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date range picker */}
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
              <Calendar className="text-emerald-400 w-5 h-5 shrink-0" />
              <div className="grid grid-cols-2 gap-2 w-full">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white font-semibold text-xs cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Return Date</span>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white font-semibold text-xs cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Sort & Quick Reset */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 px-3 py-2 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sort Order</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-semibold text-xs cursor-pointer"
                >
                  <option value="recommended" className="bg-slate-900 text-white">Curated: Recommended</option>
                  <option value="priceAsc" className="bg-slate-900 text-white">Price: Low to High</option>
                  <option value="priceDesc" className="bg-slate-900 text-white">Price: High to Low</option>
                  <option value="powerDesc" className="bg-slate-900 text-white">Power: Highest First</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-white/10 pb-1 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Vehicle Type:
            </span>
            {[
              { id: '', label: 'All Vehicles' },
              { id: 'Cars & Supercars', label: 'Cars & Supercars' },
              { id: 'SUVs & 4x4', label: 'SUVs & 4x4' },
              { id: 'Motorcycles & Superbikes', label: 'Motorcycles & Superbikes' },
              { id: 'Watercraft & Jet Skis', label: 'Watercraft & Jet Skis' },
              { id: 'Vans & Luxury Sprinters', label: 'Vans & Sprinters' },
              { id: 'Electric Scooters & E-Bikes', label: 'Scooters & E-Bikes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterType(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                  filterType === cat.id
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 sticky top-24 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Filter Fleet
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Max Daily Rate</span>
                  <span className="text-sm font-black text-emerald-400">${priceMax}/day</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$50</span>
                  <span>$5,000+</span>
                </div>
              </div>

              {/* Transmission Type */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Transmission</span>
                {['', 'Automatic', 'Dual-Clutch', 'Manual', 'Single-Speed'].map((trans) => (
                  <button
                    key={trans}
                    onClick={() => setTransmissionFilter(trans)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      transmissionFilter === trans
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'
                    }`}
                  >
                    <span>{trans || 'All Transmissions'}</span>
                    {transmissionFilter === trans && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>

              {/* Powertrain / Fuel */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Powertrain / Fuel</span>
                {['', 'Petrol', 'Electric', 'Hybrid', 'V8', 'V12', 'Rotax'].map((fuel) => (
                  <button
                    key={fuel}
                    onClick={() => setFuelFilter(fuel)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      fuelFilter === fuel
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'
                    }`}
                  >
                    <span>{fuel ? `${fuel}` : 'All Powertrains'}</span>
                    {fuelFilter === fuel && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>

              {/* VIP Direct Owner Chat Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-white">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Direct Host Chat:
                </p>
                <p>• Message vehicle owners directly</p>
                <p>• Agree on custom delivery points</p>
                <p>• Pay offline at physical vehicle inspection</p>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:w-3/4">
            {allVehicles.length === 0 ? (
              <div className="text-center py-24 bg-slate-900 border border-white/10 rounded-3xl p-8">
                <Car className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-black text-white mb-2">No Vehicles Match Your Current Filters</h3>
                <p className="text-sm text-slate-400 mb-6">Try loosening your category or location filters to see our full inventory.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {allVehicles.map((vehicle, idx) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group rounded-3xl overflow-hidden border border-white/15 bg-slate-900 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo Area */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                        <img
                          src={vehicle.primaryImage}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                            {vehicle.type}
                          </span>
                        </div>

                        {user && (
                          <button
                            type="button"
                            onClick={() => toggleFavorite({ vehicleId: vehicle.id, isFavorite: favoriteIds.has(vehicle.id) })}
                            className="absolute top-4 right-14 p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:scale-110 transition-transform"
                            aria-label="Save to Wishlist"
                          >
                            <Heart className={`w-4 h-4 ${favoriteIds.has(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                          </button>
                        )}

                        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{vehicle.rating || 5.0}</span>
                        </div>

                        <div className="absolute bottom-3 left-4 text-xs font-semibold text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {vehicle.location}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold">{vehicle.year} • {vehicle.vehicleCategory || vehicle.type}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-white">${vehicle.dailyPrice}</span>
                            <span className="text-xs text-slate-400 block font-medium">/day</span>
                          </div>
                        </div>

                        {/* Specs Pill Strip */}
                        <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-white/10 text-center text-xs">
                          <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 block">Power</span>
                            <span className="font-bold text-white">{vehicle.horsepower || 'Verified'}</span>
                          </div>
                          <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 block">0-60</span>
                            <span className="font-bold text-emerald-400">{vehicle.acceleration?.split(' ')[0] || 'Fast'}</span>
                          </div>
                          <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 block">Capacity</span>
                            <span className="font-bold text-white">{vehicle.seats || 2} Seat{vehicle.seats > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {vehicle.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 pt-0 flex gap-2.5">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-center font-bold text-xs transition-colors"
                      >
                        Specs & Host
                      </Link>
                      <Link
                        to={`/book/${vehicle.id}`}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-center font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1"
                      >
                        <span>Rent Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
