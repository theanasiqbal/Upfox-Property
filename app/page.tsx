'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { StickyMobileCTA } from '@/components/sticky-mobile-cta';
import { PropertyCard } from '@/components/property-card';
import { MOCK_PROPERTIES } from '@/lib/data';
import { CITIES, PROPERTY_TYPES, CONTACT } from '@/lib/constants';
import {
  Search, Home, Users, Trophy, Award, Briefcase, CheckCircle, Phone,
  ArrowRight, Building2, Handshake, ShieldCheck, ChevronDown, MapPin,
  Star, Quote, MessageCircle, Laptop, DoorOpen, HomeIcon, Store, Globe, Settings,
} from 'lucide-react';

export default function HomePage() {
  const featuredProperties = MOCK_PROPERTIES.filter((p) => p.featured && p.status === 'approved').slice(0, 6);
  const router = useRouter();

  // Search state
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [listingType, setListingType] = useState('');
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
    if (listingType) params.set('type', listingType);
    if (priceRange < 100000000) params.set('maxPrice', String(priceRange));
    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ''}`);
  };

  const services = [
    { icon: Building2, title: 'Office Space for Rent', description: 'Flexible leases in prime business areas', href: '/services' },
    { icon: Laptop, title: 'Co-Working Spaces', description: 'Starting from ₹999/month', href: '/services' },
    { icon: DoorOpen, title: 'Meeting Rooms', description: 'Hourly bookings with full AV setup', href: '/services' },
    { icon: HomeIcon, title: 'Residential Rentals', description: 'Quality homes for families', href: '/services' },
    { icon: Store, title: 'Commercial Properties', description: 'Shops, showrooms & spaces', href: '/services' },
    { icon: Globe, title: 'Virtual Office', description: 'Business address & GST registration', href: '/services' },
    { icon: Settings, title: 'Property Management', description: 'Complete property care', href: '/services' },
  ];

  const testimonials = [
    {
      name: 'Vikram Singh',
      role: 'Business Owner, Civil Lines',
      text: 'Upfoxx Floors helped me find the perfect office space in Civil Lines within a week. The team understood my requirements perfectly and the space is excellent for my consulting firm.',
      rating: 5,
    },
    {
      name: 'Neha Agarwal',
      role: 'Startup Founder',
      text: 'The co-working space is incredible value for money. Starting at ₹999, I get WiFi, AC, tea/coffee — everything a startup needs. The community here is very supportive.',
      rating: 5,
    },
    {
      name: 'Rakesh & Meena Gupta',
      role: 'Family, Rajendra Nagar',
      text: 'We were looking for a spacious 3BHK on rent and Upfoxx made the process so smooth. Verified listings, transparent pricing, and great support throughout.',
      rating: 5,
    },
  ];

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
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
            alt="Premium workspace in Bareilly"
            className="w-full h-full object-cover"
          />
          {/* Light mode overlay */}
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight font-heading">
              Find the Perfect{' '}
              <span className="gradient-text">Property</span>
              <br />
              & <span className="gradient-text">Workspace</span> in Bareilly
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Premium office spaces, co-working hubs, rental homes & commercial properties in Civil Lines & prime Bareilly locations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                href="/properties"
                className="px-8 py-3.5 btn-gradient font-semibold rounded-full text-lg flex items-center gap-2"
              >
                View Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`tel:${CONTACT.phone}`}
                className="px-8 py-3.5 bg-dark-blue hover:bg-dark-blue-dark text-white font-semibold rounded-full text-lg flex items-center gap-2 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a
                href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I am looking for a property in Bareilly.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full text-lg flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Now
              </a>
            </div>
          </div>

          {/* Interactive Search Bar */}
          <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-2xl backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-none p-6 md:p-8 max-w-5xl mx-auto border border-gray-100 dark:border-white/15">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="dark:bg-navy-700">All Bareilly</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city} className="dark:bg-navy-700">{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
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
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.id} value={type.id} className="dark:bg-navy-700">{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Status (Rent / Buy) */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
                <div className="relative">
                  <Handshake className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="dark:bg-navy-700">All</option>
                    <option value="rent" className="dark:bg-navy-700">For Rent</option>
                    <option value="sale" className="dark:bg-navy-700">For Sale</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max Price</label>
                  <span className="text-sm font-semibold text-accent-purple">
                    {priceRange >= 100000000 ? 'Any' : formatPrice(priceRange)}
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min={500}
                    max={100000000}
                    step={500}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-purple [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent-purple/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-purple [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">₹500</span>
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
              <span>Search Property</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================
          SERVICES HIGHLIGHT SECTION
          ============================================ */}
      <section className="py-20 bg-gray-50 dark:bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight font-heading">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive solutions for all your real estate & workspace needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={idx}
                  href={service.href}
                  className="bg-white dark:bg-white/5 dark:backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 group text-center"
                >
                  <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-accent-purple" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 font-heading">{service.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                  <span className="text-sm font-semibold text-accent-purple flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED PROPERTIES
          ============================================ */}
      <section className="py-20 bg-white dark:bg-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight font-heading">
              Featured <span className="gradient-text">Properties</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Handpicked premium listings in Bareilly
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
          WHY CHOOSE UPFOXX FLOORS
          ============================================ */}
      <section className="py-20 bg-gray-50 dark:bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight font-heading">
              Why Choose <span className="gradient-text">Upfoxx Floors</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Trusted real estate solutions in Bareilly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Prime Civil Lines Locations', description: 'Properties in the most sought-after locations of Bareilly including Civil Lines and prime residential areas.' },
              { icon: ShieldCheck, title: 'Verified Listings', description: 'Every property is personally verified by our team before listing. No fake listings, guaranteed.' },
              { icon: CheckCircle, title: 'Transparent Pricing', description: 'Clear, upfront pricing with no hidden charges. What you see is what you pay.' },
              { icon: Award, title: 'Admin Approved Properties', description: 'All properties go through a strict admin approval process ensuring quality and authenticity.' },
              { icon: Users, title: 'Dedicated Support', description: 'Our team is available to assist you throughout your property search and transaction journey.' },
              { icon: Briefcase, title: 'Professional Management', description: 'End-to-end property management services for owners including tenant handling and maintenance.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-8 border border-gray-100 dark:border-white/10 hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-accent-purple" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-heading">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS
          ============================================ */}
      <section className="py-20 bg-white dark:bg-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight font-heading">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real stories from real people in Bareilly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300">
                <Quote className="w-8 h-8 text-accent-purple/30 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent-purple fill-accent-purple" />
                  ))}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white font-heading">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          STRONG CTA SECTION
          ============================================ */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-blue via-dark-blue-dark to-navy-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight font-heading">
            Looking for Property in <span className="text-gold">Bareilly</span>?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Get in touch with our expert team or list your property for thousands of potential buyers and tenants
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-blue font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg shadow-xl"
            >
              <Phone className="w-5 h-5" />
              Call Now: {CONTACT.phone}
            </a>
            <a
              href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I am looking for a property in Bareilly.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 text-lg shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Now
            </a>
            <Link
              href="/dashboard/seller/properties/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-full hover:scale-105 transition-all duration-300 text-lg shadow-xl"
            >
              Post Your Property
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </div>
  );
}
