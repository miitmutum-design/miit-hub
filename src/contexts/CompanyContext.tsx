
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of notification preferences
export interface NotificationSettings {
  newBusiness: boolean;
  offers: boolean;
  events: boolean;
}

// Define the shape of the user profile data
export interface CompanyProfile {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  description: string;
  plan: 'Prata' | 'Gold';
  tokens: number;
  subscriptionEndDate: string;
  userType: 'Consumer' | 'Company';
  notificationSettings: NotificationSettings;
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

// Initial mock data for a demo user (visitor)
const initialDemoProfile: CompanyProfile = {
  id: 'user-demo',
  name: "Visitante",
  category: "Consumidor",
  email: "demo@example.com",
  phone: "(65) 99999-9999",
  logoUrl: null,
  backgroundUrl: null,
  description: "Este é um perfil de usuário de demonstração. Edite-o para ver as alterações.",
  plan: 'Prata',
  tokens: 0,
  subscriptionEndDate: new Date().toISOString(),
  userType: 'Consumer',
  notificationSettings: {
    newBusiness: true,
    offers: true,
    events: true,
  },
};

// Mock data for company profiles that can be redeemed
export const mockCompanyProfiles: { [key: string]: CompanyProfile } = {
  'company-gold': {
    id: 'company-gold',
    name: "Empresa Gold",
    category: "Tecnologia",
    email: "contato@gold.com",
    phone: "(11) 98765-4321",
    logoUrl: null,
    backgroundUrl: null,
    description: "Empresa Gold: líder de mercado em soluções inovadoras. Oferecemos qualidade e excelência, com foco total na satisfação do cliente. Nossa equipe experiente está pronta para atender suas necessidades com agilidade e profissionalismo, garantindo os melhores resultados para o seu negócio.",
    plan: 'Gold',
    tokens: 200,
    subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    userType: 'Company',
    notificationSettings: { newBusiness: true, offers: true, events: true },
  },
  'company-silver': {
    id: 'company-silver',
    name: "Empresa Prata",
    category: "Serviços",
    email: "contato@prata.com",
    phone: "(21) 91234-5678",
    logoUrl: null,
    backgroundUrl: null,
    description: "Empresa Prata: a solução ideal para o seu dia a dia. Combinamos tradição e modernidade para entregar produtos e serviços de confiança. Nosso compromisso é com a sua satisfação, oferecendo um atendimento personalizado e eficiente para superar suas expectativas.",
    plan: 'Prata',
    tokens: 15,
    subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    userType: 'Company',
    notificationSettings: { newBusiness: true, offers: true, events: true },
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
  hasNotifications: boolean;
  clearNotifications: () => void;
}

// Create the context with a default value
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Create the provider component
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialDemoProfile);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<ClaimedEvent[]>([]);
  const [hasNotifications, setHasNotifications] = useState(true); // Default to true for demo

  const logoutCompany = () => {
    setCompanyProfile(initialDemoProfile);
    setFavorites([]);
    setClaimedOffers([]);
    setClaimedEvents([]);
    setHasNotifications(true); // Reset for next session
  };

  const clearNotifications = () => {
    setHasNotifications(false);
  }

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
        claimEvent,
        hasNotifications,
        clearNotifications
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

    