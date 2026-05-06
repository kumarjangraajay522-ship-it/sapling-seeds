import React, { Suspense, lazy } from 'react';
import Hero from '../../components/Hero';

// Lazy loaded components for performance
const DoYouKnow = lazy(() => import('../../components/DoYouKnow'));
const CourseCard = lazy(() => import('../../components/CourseCard'));
const WhyBamboo = lazy(() => import('../../components/WhyBamboo'));
const OurClients = lazy(() => import('../../components/OurClients'));
const CollectionHero = lazy(() => import('../../components/CollectionHero'));
const WhatWeSell = lazy(() => import('../../components/WhatWeSell'));
const BetterChoice = lazy(() => import('../../components/BetterChoice'));
const TrustSignals = lazy(() => import('../../components/TrustSignals'));

const ECO_STARTER_KIT = {
  id: 'eco-starter-kit',
  title: 'Eco Starter Kit for Everyday Living',
  category: 'Starter Collection',
  image: '/images/eco-kit.jpg',
  features: ['Plastic-Free Essentials', 'Reusable & Long-Lasting', 'Safe, Non-Toxic', 'Perfect for Beginners'],
  price: '₹999',
  oldPrice: '₹1,299'
};

const Home = () => {
  return (
    <div className="home-container">

      {/* Section 1: Hero & Essential Intro */}
      <Hero />

      <Suspense fallback={<div style={{ height: '600px', background: 'var(--color-bg)' }} />}>
        <DoYouKnow />
      </Suspense>

      <Suspense fallback={<div style={{ height: '800px', background: 'var(--color-bg)' }} />}>
        <CollectionHero />
      </Suspense>

      <Suspense fallback={<div style={{ height: '700px', background: 'var(--color-bg)' }} />}>
        <WhatWeSell />
      </Suspense>

      <Suspense fallback={<div style={{ height: '600px', background: 'var(--color-bg)' }} />}>
        <BetterChoice />
      </Suspense>

      <section className="py-12 md:py-20 bg-[var(--color-bg)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#898780]/20 rounded-full -mr-48 -mt-48 pointer-events-none blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/10 rounded-full -ml-40 -mb-40 pointer-events-none blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="flex flex-col items-center text-center mb-12 md:mb-20 px-4 md:px-0" style={{ width: '100%', textAlign: 'center' }}>
            <div className="inline-block mb-4">
              <span className="text-xs md:text-base font-semibold text-[#4caf50] uppercase tracking-widest bg-[var(--color-bg)]/10 px-4 py-1.5 rounded-full border border-[#898780]/30" style={{ color: 'darkgreen' }}>Starter Collection</span>
            </div>
            <h2 className="font-serif text-[#1a241a] mb-6 leading-tight px-2 text-center" style={{ width: '100%', color: 'darkgreen', fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>Start Your Eco Journey</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1.5 bg-gradient-to-r from-transparent via-[#4caf50] to-transparent rounded-full opacity-60"></div>
            </div>
            <p className="text-base md:text-xl text-gray-900 max-w-3xl mx-auto font-light leading-relaxed px-4 text-center" style={{ color: 'darkgreen' }}>
              Kickstart your sustainable journey with thoughtfully curated essentials.
              <span className="block mt-2">Designed to reduce waste and replace plastic in your daily life.</span>
            </p>
          </div>
          <Suspense fallback={<div style={{ height: '500px' }} />}>
            <CourseCard course={ECO_STARTER_KIT} />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<div style={{ height: '600px' }} />}>
        <WhyBamboo />
      </Suspense>

      <Suspense fallback={<div style={{ height: '400px' }} />}>
        <TrustSignals />
      </Suspense>

      <Suspense fallback={<div style={{ height: '300px' }} />}>
        <OurClients />
      </Suspense>
    </div>
  );
};

export default Home;
