import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, MapPin, Car, Settings, Fuel, Heart, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useVehicle } from '../api/vehicleApi';
import { useFavorites, useToggleFavorite } from '../api/favoriteApi';
import { useCreateReview } from '../api/reviewApi';

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const VehicleDetailPage = () => {
  const { vehicleId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);
  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: createReview, isPending: isReviewing } = useCreateReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  if (isLoading) return <div className="min-h-screen pt-32 text-center text-gray-500">Loading...</div>;
  if (isError || !vehicle) return <div className="min-h-screen pt-32 text-center text-red-500">Vehicle not found.</div>;

  const isFavorite = favorites.some((v) => v.id === vehicle.id);
  const isOwner = user && vehicle.ownerId === user.id;
  const avgRating =
    vehicle.reviews?.length > 0
      ? (vehicle.reviews.reduce((sum, r) => sum + r.rating, 0) / vehicle.reviews.length).toFixed(1)
      : null;
  const ownerName = vehicle.organization?.name || `${vehicle.owner?.firstName || ''} ${vehicle.owner?.lastName || ''}`.trim();
  const imageUrl = vehicle.images?.[0]?.url
    ? `${apiBase}${vehicle.images[0].url}`
    : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200';

  const onFavorite = () => {
    if (!user) return;
    toggleFavorite({ vehicleId: vehicle.id, isFavorite });
  };

  const onSubmitReview = (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewError('');
    setReviewSuccess('');
    createReview({ vehicleId: vehicle.id, rating, comment }, {
      onSuccess: () => {
        setComment('');
        setReviewSuccess('Your review has been submitted successfully! Thank you for your feedback.');
      },
      onError: (err) => {
        setReviewError(err?.response?.data?.message || 'Failed to submit review. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <img src={imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-80 lg:h-[28rem] object-cover" />
          </div>
          <div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{vehicle.make} {vehicle.model}</h1>
                <p className="text-gray-600 font-semibold mt-1">{vehicle.type} · {vehicle.year}</p>
              </div>
              {user && !isOwner && (
                <button
                  type="button"
                  onClick={onFavorite}
                  className="p-3 rounded-full bg-white shadow-md border border-gray-200"
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              )}
            </div>
            <p className="flex items-center gap-2 text-gray-700 font-medium mt-4">
              <MapPin className="w-4 h-4 text-primary-600" /> {vehicle.location}
            </p>
            <p className="flex items-center gap-2 text-gray-700 font-medium mt-2">
              <ShieldCheck className="w-4 h-4 text-primary-600" /> Hosted by {ownerName || 'Verified host'}
            </p>
            {avgRating && (
              <p className="flex items-center gap-1 mt-3 font-bold text-gray-900">
                <Star className="w-5 h-5 text-yellow-500 fill-current" /> {avgRating} ({vehicle.reviews.length} reviews)
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-1"><Car className="w-4 h-4 text-gray-500" /> {vehicle.seats} seats</span>
              <span className="flex items-center gap-1"><Settings className="w-4 h-4 text-gray-500" /> {vehicle.transmission}</span>
              <span className="flex items-center gap-1"><Fuel className="w-4 h-4 text-gray-500" /> {vehicle.fuelType}</span>
            </div>
            <p className="mt-6 text-gray-700 font-medium leading-relaxed">{vehicle.description}</p>
            <div className="mt-8 flex items-end gap-4">
              <div>
                <span className="text-4xl font-bold text-primary-700">${vehicle.dailyPrice}</span>
                <span className="text-gray-600 font-semibold"> /day</span>
                <p className="text-sm text-gray-600 font-medium mt-1">Security deposit ${vehicle.securityDeposit}</p>
              </div>

              {/* Owner sees a badge instead of a Book button */}
              {isOwner ? (
                <div className="ml-auto flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 font-bold px-5 py-3 rounded-xl text-sm">
                  🚗 This is your vehicle
                </div>
              ) : (
                <Link
                  to={user ? `/book/${vehicle.id}` : '/login'}
                  className="ml-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-md"
                >
                  Book now
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          {vehicle.reviews?.length ? (
            <div className="space-y-4 mb-8">
              {vehicle.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <p className="font-bold text-gray-900">
                    {review.reviewer?.firstName} {review.reviewer?.lastName}
                    <span className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}</span>
                  </p>
                  {review.comment && <p className="text-gray-700 font-medium mt-1">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 font-medium mb-8">No reviews yet. Be the first after your rental.</p>
          )}

          {/* Only non-owners can leave reviews */}
          {user && !isOwner ? (
            <form onSubmit={onSubmitReview} className="max-w-lg space-y-4">
              {reviewError && (
                <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-xl text-sm font-semibold">
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="p-3.5 bg-green-50 border border-green-300 text-green-800 rounded-xl text-sm font-semibold">
                  {reviewSuccess}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Your rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-primary-500">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} stars</option>
                  ))}
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" disabled={isReviewing} className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold disabled:opacity-50 hover:bg-primary-700">
                {isReviewing ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          ) : !user ? (
            <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in to leave a review</Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
