'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the company profile data
export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  plan: 'Prata' | 'Gold';
  tokens: number;
  subscriptionEndDate: string; 
}

// Define the shape of a claimed offer
export interface ClaimedOffer {
  id: string;
  businessName: string;
  title: string;
  validUntil: string;
  discount: string;
  couponCode: string;
  claimedAt: string;
}

// Define the shape of a claimed event ticket
export interface ClaimedEvent {
  id: string;
  companyId: string;
  businessName: string;
  title: string;
  date: string;
  claimedAt: string;
}

// Initial mock data for a demo user
const initialDemoProfile: CompanyProfile = {
  id: 'user-demo',
  name: "Usuário Demo",
  email: "demo@example.com",
  phone: "(65) 99999-9999",
  logoUrl: null,
  plan: 'Prata',
  tokens: 0,
  subscriptionEndDate: new Date().toISOString(),
};

// Mock data for company profiles that can be redeemed
export const mockCompanyProfiles: { [key: string]: CompanyProfile } = {
  'company-gold': {
    id: 'company-gold',
    name: "Empresa Gold",
    email: "contato@gold.com",
    phone: "(11) 98765-4321",
    logoUrl: null,
    plan: 'Gold',
    tokens: 200,
    subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
  },
  'company-silver': {
    id: 'company-silver',
    name: "Empresa Prata",
    email: "contato@prata.com",
    phone: "(21) 91234-5678",
    logoUrl: null,
    plan: 'Prata',
    tokens: 15,
    subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
  }
};


// Define the context shape
interface CompanyContextType {
  companyProfile: CompanyProfile;
  setCompanyProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  logoutCompany: () => void;
  favorites: string[];
  toggleFavorite: (companyId: string) => void;
  isFavorited: (companyId: string) => boolean;
  claimedOffers: ClaimedOffer[];
  claimOffer: (offer: Omit<ClaimedOffer, 'claimedAt'>, limit: number) => void;
  claimedEvents: ClaimedEvent[];
  claimEvent: (event: Omit<ClaimedEvent, 'claimedAt'>, limit: number) => void;
}

// Create the context with a default value
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Create the provider component
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialDemoProfile);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<ClaimedEvent[]>([]);

  const logoutCompany = () => {
    setCompanyProfile(initialDemoProfile);
    setFavorites([]);
    setClaimedOffers([]);
    setClaimedEvents([]);
  };

  const toggleFavorite = (companyId: string) => {
    setFavorites(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId) 
        : [...prev, companyId]
    );
  };

  const isFavorited = (companyId: string) => {
    return favorites.includes(companyId);
  }

  const claimOffer = (offer: Omit<ClaimedOffer, 'claimedAt'>, limit: number) => {
    const timesClaimed = claimedOffers.filter(o => o.id === offer.id).length;
    if (timesClaimed >= limit) {
      console.warn("Offer claim limit reached.");
      return;
    }

    const newClaimedOffer: ClaimedOffer = {
      ...offer,
      claimedAt: new Date().toISOString(),
    };
    setClaimedOffers(prev => [...prev, newClaimedOffer]);
  };

  const claimEvent = (event: Omit<ClaimedEvent, 'claimedAt'>, limit: number) => {
    const timesClaimed = claimedEvents.filter(e => e.id === event.id).length;
    if (timesClaimed >= limit) {
      console.warn("Event claim limit reached.");
      return;
    }
    
    const newClaimedEvent: ClaimedEvent = {
      ...event,
      claimedAt: new Date().toISOString(),
    };
    setClaimedEvents(prev => [...prev, newClaimedEvent]);
  }

  return (
    <CompanyContext.Provider value={{ 
        companyProfile, 
        setCompanyProfile, 
        logoutCompany, 
        favorites, 
        toggleFavorite, 
        isFavorited,
        claimedOffers,
        claimOffer,
        claimedEvents,
        claimEvent
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Create a custom hook to use the context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
