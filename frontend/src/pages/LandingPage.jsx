import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Crown,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FLEET_VEHICLES, FLEET_CATEGORIES, TESTIMONIALS } from '../content/fleetData';

const SPOTLIGHT_VEHICLES = [
  FLEET_VEHICLES[0], // Ferrari 12Cilindri (Supercar)
  FLEET_VEHICLES[5], // Ducati Panigale V4 S (Superbike)
  FLEET_VEHICLES[7], // Mercedes-AMG G63 (Luxury SUV)
  FLEET_VEHICLES[9], // Sea-Doo RXT-X 300 (Watercraft)
  FLEET_VEHICLES[2], // Rimac Nevera (Hyper-EV)
  FLEET_VEHICLES[10], // Mercedes Sprinter VIP Jet Lounge (Van)
];

const POPULAR_CITIES = [
  'Beverly Hills, CA',
  'Miami Beach, FL',
  'Las Vegas, NV',
  'San Francisco, CA',
  'New York, NY',
];

const QUICK_CATEGORIES = [
  { label: 'Supercars', icon: '🏎️', type: 'Cars & Supercars' },
  { label: 'Superbikes', icon: '🏍️', type: 'Motorcycles & Superbikes' },
  { label: 'Watercraft', icon: '🌊', type: 'Watercraft & Jet Skis' },
  { label: 'Luxury 4x4', icon: '🚙', type: 'SUVs & 4x4' },
  { label: 'VIP Sprinters', icon: '🚐', type: 'Vans & Luxury Sprinters' },
  { label: 'Hyper-EVs', icon: '⚡', type: 'Cars & Supercars' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('Beverly Hills, CA');
  const [dates, setDates] = useState({
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
  });

  const activeVehicle = SPOTLIGHT_VEHICLES[activeSpotlightIndex] || SPOTLIGHT_VEHICLES[0];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (dates.startDate) params.set('startDate', dates.startDate);
    if (dates.endDate) params.set('endDate', dates.endDate);
    if (selectedCategory !== 'all') params.set('type', selectedCategory);
    navigate(`/search?${params.toString()}`);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredFleet =
    selectedCategory === 'all'
      ? FLEET_VEHICLES
      : FLEET_VEHICLES.filter((v) => v.type === selectedCategory);

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-emerald-500 selection:text-white">
      {/* ── 1. Hero Section - Strictly Confined to First Viewport ── */}
      <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-8 overflow-hidden z-10">
        {/* Cool light opacity background image - strictly inside first viewport */}
        <div className="absolute top-0 inset-x-0 h-full max-h-screen overflow-hidden pointer-events-none z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity scale-105"
            style={{ backgroundImage: "url('/cars/supercar-fleet.jpg')" }}
          />
          {/* Smooth bottom gradient fade to slate-950 so image never spills into next sections */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950" />
          <div className="absolute inset-0 bg-radial-luxury" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[44rem] h-[22rem] bg-emerald-500/10 rounded-full blur-[140px]" />
        </div>

        {/* Hero Top Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col justify-center items-center text-center my-auto">
          {/* Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg shadow-emerald-500/10 mb-4 sm:mb-6"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Multi-Vehicle Peer & Fleet Rental Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-4 sm:mb-6"
          >
            Rent Any Vehicle. <br />
            <span className="text-gradient">Land, Track & Water.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8"
          >
            Supercars, superbikes, luxury 4x4 SUVs, watercraft, and VIP Sprinter vans. Direct chat with verified owners and transparent bookings.
          </motion.p>

          {/* ── Search Bar Floating Widget (Right in First Viewport) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/80"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
              {/* Location */}
              <div className="flex flex-col text-left px-3 py-2 bg-white/5 rounded-2xl border border-white/5">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" /> Handover City
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-bold text-xs cursor-pointer"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">
                      {city}
                    </option>
                  ))}
                  <option value="" className="bg-slate-900 text-white">All Locations</option>
                </select>
              </div>

              {/* Pickup Date */}
              <div className="flex flex-col text-left px-3 py-2 bg-white/5 rounded-2xl border border-white/5">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> Pickup Date
                </label>
                <input
                  type="date"
                  value={dates.startDate}
                  onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                  className="w-full bg-transparent border-none outline-none text-white font-bold text-xs cursor-pointer"
                />
              </div>

              {/* Return Date */}
              <div className="flex flex-col text-left px-3 py-2 bg-white/5 rounded-2xl border border-white/5">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> Return Date
                </label>
                <input
                  type="date"
                  min={dates.startDate}
                  value={dates.endDate}
                  onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                  className="w-full bg-transparent border-none outline-none text-white font-bold text-xs cursor-pointer"
                />
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Fleet</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* First Viewport Bottom Controls: Category Quick Jump & Showroom Arrow */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4">
            {/* Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0 hidden md:inline">
                Quick Jump:
              </span>
              {QUICK_CATEGORIES.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(q.type);
                    scrollToSection('showroom');
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 text-xs font-semibold text-slate-300 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Scroll Indicator */}
            <button
              type="button"
              onClick={() => scrollToSection('showroom')}
              className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Spotlight Showroom</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-emerald-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Interactive Spotlight Showroom (Section 2) ── */}
      <section id="showroom" className="py-20 bg-slate-950 relative border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-2">
              Featured Fleet Machines
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Interactive Spotlight Showroom
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Switch between exotics, superbikes, luxury 4x4 SUVs, and high-performance watercraft.
            </p>
          </div>

          {/* Spotlight Vehicle Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {SPOTLIGHT_VEHICLES.map((vehicle, idx) => (
              <button
                key={vehicle.id}
                onClick={() => setActiveSpotlightIndex(idx)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 ${
                  activeSpotlightIndex === idx
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <span>{vehicle.make} {vehicle.model.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 uppercase tracking-wider">({vehicle.type.split(' ')[0]})</span>
                {activeSpotlightIndex === idx && <Flame className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            ))}
          </div>

          {/* Active Vehicle Showcase Card */}
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVehicle.id}
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -15 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden border border-white/15 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 md:p-8"
              >
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  {/* Left: Vehicle Details & HUD */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                        {activeVehicle.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-bold">
                        {activeVehicle.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        📍 {activeVehicle.location}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                        {activeVehicle.make} {activeVehicle.model}
                      </h3>
                      <p className="text-emerald-400 font-semibold text-sm mt-1">
                        {activeVehicle.tagline}
                      </p>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                      {activeVehicle.description}
                    </p>

                    {/* Performance HUD Grid */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/10">
                      <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Power
                        </span>
                        <span className="text-sm sm:text-base font-black text-white">{activeVehicle.horsepower}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Acceleration
                        </span>
                        <span className="text-sm sm:text-base font-black text-emerald-400">{activeVehicle.acceleration}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Top Velocity
                        </span>
                        <span className="text-sm sm:text-base font-black text-white">{activeVehicle.topSpeed}</span>
                      </div>
                    </div>

                    {/* Price and CTA row */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-white">
                            ${activeVehicle.dailyPrice}
                          </span>
                          <span className="text-slate-400 font-semibold text-xs">/day</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Deposit: ${activeVehicle.securityDeposit} • Verified Host
                        </p>
                      </div>

                      <div className="flex gap-2.5">
                        <Link
                          to={`/vehicles/${activeVehicle.id}`}
                          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all"
                        >
                          Specs
                        </Link>
                        <Link
                          to={`/book/${activeVehicle.id}`}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 hover:scale-[1.02] transition-all"
                        >
                          <span>Rent</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right: Dramatic Vehicle Photo */}
                  <div className="lg:col-span-7 relative group">
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 aspect-[16/10] shadow-2xl">
                      <img
                        src={activeVehicle.primaryImage}
                        alt={`${activeVehicle.make} ${activeVehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Floating Rating Badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white shadow-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{activeVehicle.rating} ({activeVehicle.reviewCount} Verified Rentals)</span>
                      </div>

                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                        Direct Host Handover
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 3. Trust Metrics Bar ── */}
      <section className="border-y border-white/10 bg-slate-900/40 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl md:text-4xl font-black text-white">All Vehicle Types</span>
              <p className="text-xs md:text-sm text-slate-400 font-semibold">Cars, Bikes, Watercraft, Vans & SUVs</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl md:text-4xl font-black text-emerald-400">Direct Chat</span>
              <p className="text-xs md:text-sm text-slate-400 font-semibold">Instant Buyer-to-Owner Messaging</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl md:text-4xl font-black text-white">100% Insured</span>
              <p className="text-xs md:text-sm text-slate-400 font-semibold">Allianz & Commercial Partner Cover</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl md:text-4xl font-black text-amber-400">4.99 ★</span>
              <p className="text-xs md:text-sm text-slate-400 font-semibold">Over 1,800+ Verified Rentals</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Diverse Vehicle Fleet Catalog ── */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-2">
                All-in-One Mobility
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Available Vehicle Fleet
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Filter by vehicle category: supercars, motorcycles, yachts, jet skis, and executive vans.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto mt-6 md:mt-0 pb-2 scrollbar-none">
              {FLEET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-slate-900 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
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

                    <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{vehicle.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-4 text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {vehicle.location}
                    </div>
                  </div>

                  {/* Body Content */}
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
                        <span className="font-bold text-white">{vehicle.horsepower}</span>
                      </div>
                      <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Performance</span>
                        <span className="font-bold text-emerald-400">{vehicle.acceleration.split(' ')[0]}</span>
                      </div>
                      <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Capacity</span>
                        <span className="font-bold text-white">{vehicle.seats} Seat{vehicle.seats > 1 ? 's' : ''}</span>
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
                    View Specs
                  </Link>
                  <Link
                    to={`/book/${vehicle.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-center font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-sm tracking-wide transition-all hover:scale-105"
            >
              <span>Explore All {FLEET_VEHICLES.length} Vehicles Across All Classes</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Direct Host Chat Feature Spotlight (Clean Dark Card, No Duplicate BG) ── */}
      <section className="py-24 bg-slate-900/60 border-y border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-4">
                <MessageSquare className="w-3.5 h-3.5" /> Direct Chat Feature
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
                Chat Directly With Vehicle Owners & Hosts
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                Connect directly with verified individual owners, fleet managers, and yacht captains before and after booking. Coordinate exact pickup spots, track permits, or bespoke accessory requests in real-time.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { title: 'In-App Live Chat Hub', desc: 'Real-time Socket.IO direct messaging between buyer and host with instant updates.' },
                  { title: 'Multi-Vehicle Fleet Coverage', desc: 'Rent exotics, superbikes, jet skis, and executive Sprinter vans through one unified platform.' },
                  { title: 'Safe In-Person Handover', desc: 'Inspect your vehicle at pickup; offline deposit security and transparent checks.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-emerald-500 text-white shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Link
                  to="/messages"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Chat Hub</span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm transition-all"
                >
                  <span>How EasyGo Works</span>
                </Link>
              </div>
            </div>

            {/* Visual Chat Demo Mockup */}
            <div className="relative">
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white text-sm">
                      AE
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Apex Exotic Reserve</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold">● Online • Host of Ferrari 12Cilindri</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Host
                  </span>
                </div>

                <div className="space-y-3 py-2 text-xs">
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl max-w-[80%] text-slate-300">
                      Hi! Can we arrange delivery to Beverly Wilshire Hotel at 10 AM tomorrow?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-emerald-500 p-3 rounded-2xl max-w-[80%] text-white font-medium shadow-md shadow-emerald-500/20">
                      Absolutely! The 12Cilindri is polished and ready. Our concierge will meet you in the hotel driveway with keys and handover inspection.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl max-w-[80%] text-slate-300">
                      Perfect. Does it include the track telemetry pack?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-emerald-500 p-3 rounded-2xl max-w-[80%] text-white font-medium shadow-md shadow-emerald-500/20">
                      Yes, fully loaded with telemetry and 150 daily miles included. See you tomorrow!
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <div className="flex-1 bg-white/5 px-3.5 py-2.5 rounded-xl border border-white/10 text-slate-400 text-xs">
                    Type inquiry to host…
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Explore By Category ── */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-2">
              Browse Vehicles
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              Explore By Vehicle Class
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              From asphalt to waves: select the machine that fits your journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLEET_CATEGORIES.slice(1).map((category) => (
              <Link
                key={category.id}
                to={`/search?type=${encodeURIComponent(category.id)}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/10 shadow-lg hover:border-emerald-500/60 transition-all duration-500 flex flex-col justify-end p-6"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white inline-block mb-2">
                    {category.count}
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-3 group-hover:translate-x-1 transition-transform">
                    View Vehicles <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Verified Renter Testimonials ── */}
      <section className="py-24 bg-slate-900/40 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-2">
              Verified Experiences
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              What Our Renters Say
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Read real reviews from drivers, riders, and captains using EasyGo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-slate-900 border border-white/10 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1">
                      {t.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Rented: <span className="text-emerald-400">{t.car}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. VIP Call to Action ── */}
      <section className="relative py-28 overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/cars/lamborghini-terzo.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider inline-block mb-6">
              Have Vehicles Sitting Idle?
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              List Your Car, Bike, Van or Watercraft.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Turn your garage, marina slip, or commercial fleet into an automated revenue generator. Set your own rules, chat directly with renters, and enjoy full insurance coverage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-8 py-4 rounded-full font-black text-base transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Browse All Available Vehicles</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/list"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                <span>List Your Vehicle</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
