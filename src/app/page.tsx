
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessCard from '@/components/BusinessCard';
import { businesses, type Business } from '@/lib/data';
import HomeHeader from '@/components/common/HomeHeader';
import { mockCompanyProfiles } from '@/contexts/CompanyContext';
import { isCompanyActuallyOpen } from '@/lib/availability';
import SearchBar from '@/components/common/SearchBar';
import PremiumCarousel from '@/components/common/PremiumCarousel';
import SponsorCarousel from '@/components/common/SponsorCarousel';
import SponsorsGrid from '@/components/common/SponsorsGrid';
import VideoPlayer from '@/components/common/VideoPlayer';

export default function Home() {

  return (
    <div className="container mx-auto max-w-3xl pt-6 sm:pt-8 pb-10">
      <HomeHeader />

      <div className="relative mb-6">
        <SearchBar />
      </div>

      <div className="mb-8">
        <PremiumCarousel />
      </div>

      <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-headline">Vitrine de Carrossel</h2>
          </div>
          <SponsorCarousel />
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-headline">Vitrine Estática</h2>
        </div>
        <SponsorsGrid />
      </section>

      <section className="mt-8 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-headline">Vídeo Promocional</h2>
        </div>
        <VideoPlayer />
      </section>

    </div>
  );
}
