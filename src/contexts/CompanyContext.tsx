
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of notification preferences
export interface NotificationSettings {
  newBusiness: boolean;
  offers: boolean;
  events: boolean;
}

// Define the shape for one day of the week's hours
export interface OperatingHours {
  day: string;
  isOpen: boolean;
  open: string;
  close: string;
}

export type AvailabilityStatus = 'AUTO' | 'OPEN' | 'CLOSED';


// Define the shape of the user profile data
export interface CompanyProfile {
  id: string;
  name: string;
  category: string;
  address: string | null;
  email: string;
  phone: string;
  instagram?: string;
  websiteUrl?: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  description: string;
  products: string[];
  searchTerms: string[];
  plan: 'Prata' | 'Gold';
  tokens: number;
  subscriptionEndDate: string;
  userType: 'Consumer' | 'Company';
  notificationSettings: NotificationSettings;
  availabilityStatus: AvailabilityStatus; // Master availability control
  hoursOfOperation?: OperatingHours[];
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

const defaultHours: OperatingHours[] = [
    { day: 'Segunda', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Terça', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Quarta', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Quinta', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Sexta', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Sábado', isOpen: false, open: '10:00', close: '16:00' },
    { day: 'Domingo', isOpen: false, open: '10:00', close: '14:00' },
];


// Initial mock data for a demo user (visitor)
const initialDemoProfile: CompanyProfile = {
  id: 'user-demo',
  name: "Visitante",
  category: "Consumidor",
  address: "Rua Fictícia, 123, Cidade Exemplo, Estado Exemplo",
  email: "demo@example.com",
  phone: "(65) 99999-9999",
  instagram: "@seuinstagram",
  websiteUrl: 'https://example.com',
  logoUrl: null,
  backgroundUrl: null,
  description: "Este é um perfil de usuário de demonstração. Edite-o para ver as alterações.",
  products: ["bota", "calça", "camisa", "sandalha"],
  searchTerms: [],
  plan: 'Prata',
  tokens: 0,
  subscriptionEndDate: new Date().toISOString(),
  userType: 'Consumer',
  notificationSettings: {
    newBusiness: true,
    offers: true,
    events: true,
  },
  availabilityStatus: 'AUTO',
  hoursOfOperation: defaultHours,
};

// Mock data for company profiles that can be redeemed
export const mockCompanyProfiles: { [key: string]: CompanyProfile } = {
  '1': {
    id: '1',
    name: "União Construtora",
    category: "Construção",
    address: "Avenida das Torres, 123, Nova Mutum, MT",
    email: "contato@uniaoconstrutora.com",
    phone: "(65) 91234-5678",
    logoUrl: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png",
    backgroundUrl: null,
    description: "Líder em construção civil na região.",
    products: ['Projetos Residenciais', 'Construção Comercial', 'Reformas'],
    searchTerms: [],
    plan: 'Gold',
    tokens: 500,
    subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    userType: 'Company',
    notificationSettings: { newBusiness: true, offers: true, events: true },
    availabilityStatus: 'AUTO',
    hoursOfOperation: defaultHours,
    instagram: '@uniaoconstrutora',
    websiteUrl: 'https://uniaoconstrutora.com.br'
  },
  'company-gold': {
    id: 'company-gold',
    name: "Empresa Gold",
    category: "Tecnologia",
    address: "Avenida Principal, 456, Centro, São Paulo, SP",
    email: "contato@gold.com",
    phone: "(11) 98765-4321",
    logoUrl: null,
    backgroundUrl: null,
    description: "Empresa Gold: líder de mercado em soluções inovadoras. Oferecemos qualidade e excelência, com foco total na satisfação do cliente. Nossa equipe experiente está pronta para atender suas necessidades com agilidade e profissionalismo, garantindo os melhores resultados para o seu negócio.",
    products: ['Software', 'Hardware', 'Consultoria de TI'],
    searchTerms: [],
    plan: 'Gold',
    tokens: 200,
    subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    userType: 'Company',
    notificationSettings: { newBusiness: true, offers: true, events: true },
    availabilityStatus: 'AUTO',
    hoursOfOperation: defaultHours,
    instagram: '@empresagold',
    websiteUrl: 'https://empresagold.com'
  },
  'company-silver': {
    id: 'company-silver',
    name: "Empresa Prata",
    category: "Serviços",
    address: "Rua Secundária, 789, Bairro Feliz, Rio de Janeiro, RJ",
    email: "contato@prata.com",
    phone: "(21) 91234-5678",
    logoUrl: null,
    backgroundUrl: null,
    description: "Empresa Prata: a solução ideal para o seu dia a dia. Combinamos tradição e modernidade para entregar produtos e serviços de confiança. Nosso compromisso é com a sua satisfação, oferecendo um atendimento personalizado e eficiente para superar suas expectativas.",
    products: ['Limpeza Profissional', 'Manutenção Predial'],
    searchTerms: [],
    plan: 'Prata',
    tokens: 15,
    subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    userType: 'Company',
    notificationSettings: { newBusiness: true, offers: true, events: true },
    availabilityStatus: 'AUTO',
    hoursOfOperation: defaultHours,
    instagram: '@empresaprata',
    websiteUrl: 'https://empresaprata.com'
  }
};


// Define the context shape
interface CompanyContextType {
  deviceId: string | null;
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
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only on the client
    let storedDeviceId = localStorage.getItem('deviceId');
    if (!storedDeviceId) {
      storedDeviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('deviceId', storedDeviceId);
    }
    setDeviceId(storedDeviceId);
  }, []);

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
        deviceId,
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
