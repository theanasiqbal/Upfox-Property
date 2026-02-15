'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyCard } from '@/components/property-card';
import { MOCK_PROPERTIES } from '@/lib/data';
import { Search, Home, Users, Trophy, Award, Briefcase, CheckCircle, Phone, ArrowRight, Building2, Handshake, ShieldCheck, ChevronDown, MapPin } from 'lucide-react';

export default function HomePage() {
  const featuredProperties = MOCK_PROPERTIES.filter((p) => p.status === 'approved').slice(0, 6);
  const router = useRouter();

  // Search state
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState(100000000);

  const formatPrice = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange < 100000000) params.set('maxPrice', String(priceRange));
    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-800">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center">
        {/* Single hero background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop"
            alt="Luxury property"
            className="w-full h-full object-cover"
          />
          {/* Light mode overlay — gradient reveals image at edges */}
          <div className="absolute inset-0 dark:hidden bg-gradient-to-b from-white via-white/70 to-white/40" />
          <div className="absolute inset-0 dark:hidden bg-gradient-to-r from-white/60 via-transparent to-white/60" />
          {/* Dark mode overlay */}
          <div className="absolute inset-0 hidden dark:block bg-navy-800/85" />
          <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-navy-800/60 via-transparent to-navy-800" />
        </div>

        {/* Dark mode particles */}
        <div className="hidden dark:block particles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 10}s`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay for dark mode */}
        <div className="hidden dark:block absolute inset-0 grid-pattern opacity-50" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Find Your{' '}
              <span className="gradient-text">Dream</span>
              <br />
              <span className="gradient-text">Property</span> Today
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover luxury homes with modern design and premium locations. Your journey to the perfect property starts here.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-2xl backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-none p-6 md:p-8 max-w-4xl mx-auto border border-gray-100 dark:border-white/15">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="City or area..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Property Type</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="dark:bg-navy-700">All Types</option>
                    <option value="apartment" className="dark:bg-navy-700">Apartment</option>
                    <option value="house" className="dark:bg-navy-700">House</option>
                    <option value="villa" className="dark:bg-navy-700">Villa</option>
                    <option value="commercial" className="dark:bg-navy-700">Commercial</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Price Slider */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max Price</label>
                  <span className="text-sm font-semibold text-accent-purple">
                    {priceRange >= 100000000 ? 'Any' : formatPrice(priceRange)}
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min={500000}
                    max={100000000}
                    step={500000}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-purple [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent-purple/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-purple [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">₹5L</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">₹10Cr+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full py-3 btn-gradient font-semibold rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section className="py-20 bg-gray-50 dark:bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Home, number: '1000+', label: 'Properties Listed', color: 'text-accent-cyan' },
              { icon: Users, number: '500+', label: 'Happy Clients', color: 'text-accent-purple' },
              { icon: Trophy, number: '98%', label: 'Client Satisfaction', color: 'text-accent-cyan' },
              { icon: Award, number: '150+', label: 'Awards Won', color: 'text-accent-purple' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-8 text-center border border-gray-100 dark:border-white/10 hover:scale-105 transition-all duration-300 group hover:shadow-lg dark:hover:shadow-accent-purple/10">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                <p className={`text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight ${stat.color === 'text-accent-cyan' ? 'dark:text-glow-cyan' : ''}`}>
                  {stat.number}
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED PROPERTIES
          ============================================ */}
      <section className="py-20 bg-white dark:bg-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Featured <span className="gradient-text">Properties</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Handpicked premium listings just for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, idx) => (
              <div key={property.id} className={idx >= 3 ? 'hidden md:block' : ''}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-10 py-4 btn-gradient font-semibold rounded-full text-lg"
            >
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="py-20 bg-gray-50 dark:bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Simple steps to find your dream home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Search & Explore',
                description: 'Browse through hundreds of properties with detailed information and high-quality images.',
              },
              {
                icon: Handshake,
                step: '02',
                title: 'Connect with Sellers',
                description: 'Send inquiries directly to sellers and ask questions about properties you love.',
              },
              {
                icon: ShieldCheck,
                step: '03',
                title: 'Close the Deal',
                description: 'Schedule viewings, negotiate, and finalize your property purchase with confidence.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-8 text-center border border-gray-100 dark:border-white/10 hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-accent-purple dark:text-accent-cyan" />
                </div>
                <span className="text-4xl font-bold gradient-text-purple mb-4 block">{item.step}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SERVICES SECTION
          ============================================ */}
      <section className="py-20 bg-white dark:bg-navy-700" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive solutions for all your real estate needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Briefcase,
                title: 'Property Buying & Selling',
                description: 'Complete assistance in buying and selling residential and commercial properties with expert guidance.',
              },
              {
                icon: Users,
                title: 'Rental Solutions',
                description: 'Find the perfect rental property with our comprehensive listing database and matching system.',
              },
              {
                icon: CheckCircle,
                title: 'Property Management',
                description: 'Professional property management services for landlords and investors to maximize returns.',
              },
              {
                icon: Building2,
                title: 'Investment Advisory',
                description: 'Expert guidance on real estate investments and market opportunities for smart decisions.',
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-accent-purple" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section className="py-20 bg-gray-50 dark:bg-navy-800" id="faqs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-12">
                Everything you need to know about our platform
              </p>

              <div className="space-y-4">
                {[
                  { q: 'What is Upfoxx?', a: 'Upfoxx is a premium real estate marketplace connecting buyers, sellers, and renters with high-quality properties across the country.' },
                  { q: 'How do I search for properties?', a: 'Use our advanced search filters to find properties by location, price, type, bedrooms, and amenities.' },
                  { q: 'Is there a fee to use Upfoxx?', a: 'Our basic search and browsing features are completely free. Additional premium features may have associated fees.' },
                  { q: 'Can I list my property?', a: 'Yes! Sign up as a seller and create detailed listings with photos, descriptions, and pricing information.' },
                ].map((item, idx) => (
                  <details key={idx} className="group bg-white dark:bg-white/5 dark:backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.q}</h3>
                      <span className="text-accent-purple group-open:rotate-180 transition-transform duration-300 ml-4 flex-shrink-0">▼</span>
                    </summary>
                    <p className="text-gray-600 dark:text-gray-400 px-6 pb-4 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=600&fit=crop"
                alt="FAQ"
                className="rounded-2xl w-full h-full object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple via-accent-purple-dark to-purple-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied property owners and start your journey today
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-accent-purple font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg shadow-xl"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
