import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, MapPin, Calendar, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef = useRef(null);
  const carsRef = useRef(null);
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  const searchParams = new URLSearchParams();
  if (location.trim()) searchParams.set('location', location.trim());
  if (dates.startDate && dates.endDate) {
    searchParams.set('startDate', dates.startDate);
    searchParams.set('endDate', dates.endDate);
  }

  useEffect(() => {
    if (heroRef.current && carsRef.current) {
      gsap.to(carsRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50"
      >
        {/* Soft background blobs */}
        <div className="absolute top-20 left-[-8%] w-[36rem] h-[36rem] bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 right-[-8%] w-[30rem] h-[30rem] bg-emerald-200/40 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-6 border border-green-200">
                ✨ Premium Vehicle Rentals
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-gray-900">
                Find your perfect <br />
                <span className="text-gradient">ride today.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed font-medium">
                Rent directly from local owners and top organizations. Experience the freedom of choice with our premium fleet.
              </p>

              {/* Search Box */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white border border-gray-200 rounded-3xl shadow-lg p-4 md:p-6"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex flex-col border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary-500" /> Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      type="text"
                      placeholder="Where to?"
                      className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-lg"
                    />
                  </div>
                  <div className="flex flex-col border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary-500" /> Dates
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={dates.startDate}
                        onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                        type="date"
                        aria-label="Pickup date"
                        className="min-w-0 w-1/2 bg-transparent border-none outline-none text-gray-900 font-medium"
                      />
                      <input
                        value={dates.endDate}
                        min={dates.startDate || undefined}
                        onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                        type="date"
                        aria-label="Return date"
                        className="min-w-0 w-1/2 bg-transparent border-none outline-none text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex items-center md:pl-4">
                    <Link
                      to={`/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Images */}
            <motion.div
              ref={carsRef}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block h-[560px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1503376760367-5c8d4db1c781?auto=format&fit=crop&q=80&w=1000"
                alt="Sports Car"
                className="absolute right-10 top-20 w-3/4 rounded-2xl shadow-2xl z-20 object-cover border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000"
                alt="SUV"
                className="absolute left-0 bottom-20 w-2/3 rounded-2xl shadow-2xl z-10 object-cover border-4 border-white -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Why choose EasyGo?</h2>
            <p className="text-gray-700 text-lg font-medium">We provide a seamless, premium experience from booking to return.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: 'Secure & Verified',
                desc: 'All owners, organizations, and vehicles are manually verified by our team.',
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: 'Instant Booking',
                desc: 'Book instantly and confirm offline. Simple, fast, and reliable process.',
              },
              {
                icon: <Star className="w-8 h-8 text-white" />,
                title: 'Premium Fleet',
                desc: 'Access to luxury cars, sports cars, and heavy machinery all in one place.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-6 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 relative overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Ready for your next adventure?</h2>
            <p className="text-gray-300 text-lg mb-10">Join thousands of happy renters who trust EasyGo every day.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Browse Vehicles <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/list"
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                List Your Vehicle
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
