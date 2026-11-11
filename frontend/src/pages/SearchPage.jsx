import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Star, Car, Settings, Fuel, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useVehicles } from '../api/vehicleApi';
import { useFavorites, useToggleFavorite } from '../api/favoriteApi';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [filterType, setFilterType] = useState(searchParams.get('type') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [priceMax, setPriceMax] = useState(1000);
  const [sort, setSort] = useState('recommended');

  const { user } = useSelector((state) => state.auth);
  const hasCompleteDateRange = Boolean(startDate && endDate && endDate > startDate);
  const hasInvalidDateRange = Boolean(startDate || endDate) && !hasCompleteDateRange;
  const { data: vehicles, isLoading, isError } = useVehicles({
    ...(filterType && { type: filterType }),
    ...(location.trim() && { location: location.trim() }),
    ...(hasCompleteDateRange && { startDate, endDate }),
    priceMax,
    sort,
  });
  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  const favoriteIds = new Set(favorites.map((v) => v.id));

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">

        {/* Search Header */}
        <div className="bg-white border border-gray-200 rounded-full shadow-sm p-3 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0">
            <MapPin className="text-primary-600 w-5 h-5 shrink-0" />
            <input
              type="text"
              placeholder="Where do you need a vehicle?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Search className="text-primary-600 w-5 h-5 shrink-0" />
            <div className="flex gap-2 w-full">
              <input
                type="date"
                aria-label="Pickup date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="min-w-0 w-1/2 bg-transparent border-none outline-none text-gray-900"
              />
              <input
                type="date"
                aria-label="Return date"
                min={startDate || undefined}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="min-w-0 w-1/2 bg-transparent border-none outline-none text-gray-900"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocation(location.trim())}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold transition-colors w-full md:w-auto"
          >
            Search
          </button>
        </div>

        {hasInvalidDateRange && (
          <p className="-mt-4 mb-6 text-sm text-orange-700 bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
            Choose both a pickup and return date to filter availability.
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sticky top-28 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary-600" /> Filters
                </h3>
                <button
                  onClick={() => setFilterType('')}
                  className="text-sm text-primary-600 font-semibold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Price Range</h4>
                  <span className="text-sm font-medium text-primary-700">${priceMax}/day</span>
                </div>
                <input
                  type="range"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-green-600"
                  min="0"
                  max="1000"
                  step="25"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Vehicle Type</h4>
                <div className="space-y-2">
                  {['Sedan', 'SUV', 'Luxury', 'Sports', 'Electric'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filterType === type}
                        onChange={() => setFilterType(filterType === type ? '' : type)}
                        className="w-4 h-4 rounded accent-green-600"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vehicle List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-3/4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoading ? 'Loading...' : `${vehicles?.length || 0} Vehicles Available`}
              </h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none text-gray-800 shadow-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            {isLoading && (
              <div className="text-center py-16 text-gray-500 text-lg">Loading vehicles…</div>
            )}
            {isError && (
              <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-2xl py-8 px-4">
                Error loading vehicles. Please check that the backend server is running.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {vehicles && vehicles.map((vehicle, idx) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        vehicle.images?.[0]?.url
                          ? `${apiBase}${vehicle.images[0].url}`
                          : `https://images.unsplash.com/photo-${vehicle.type === 'Sports' ? '1503376760367-5c8d4db1c781' : '1560958089-b8a1929cea89'}?auto=format&fit=crop&q=80&w=600`
                      }
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {user && (
                      <button
                        type="button"
                        onClick={() => toggleFavorite({ vehicleId: vehicle.id, isFavorite: favoriteIds.has(vehicle.id) })}
                        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                        aria-label="Save to wishlist"
                      >
                        <Heart className={`w-5 h-5 ${favoriteIds.has(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                      </button>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm text-gray-900">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" /> 4.9
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-500">{vehicle.type} • {vehicle.year}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary-700">${vehicle.dailyPrice}</span>
                        <span className="text-sm text-gray-500">/day</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-4 mt-2 border-t border-b border-gray-100 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Car className="w-4 h-4 text-gray-400" /> {vehicle.seats} Seats</span>
                      <span className="flex items-center gap-1"><Settings className="w-4 h-4 text-gray-400" /> {vehicle.transmission}</span>
                      <span className="flex items-center gap-1"><Fuel className="w-4 h-4 text-gray-400" /> {vehicle.fuelType}</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="flex-1 border border-gray-300 text-center py-3 rounded-xl font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/book/${vehicle.id}`}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-3 rounded-xl font-bold transition-colors"
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {vehicles && vehicles.length === 0 && !isLoading && (
              <div className="text-center py-16 text-gray-500">
                <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-semibold text-gray-700">No vehicles found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search area.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
