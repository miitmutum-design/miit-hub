

import { PlaceHolderImages } from './placeholder-images';
import { Car, HeartPulse, Home, Laptop, Book, Sparkles, Utensils, Wrench, Wind, Store, Globe, Camera, MessageSquare, Building, BarChart3, Check, X, Plus } from 'lucide-react';

export type Business = {
  id: string;
  name: string;
  category: string;
  distance: string;
  rating: number;
  description: string;
  reviews: string[];
  image: {
    url: string;
    hint: string;
  };
  coordinates?: {
    x: number;
    y: number;
  };
  whatsapp: string;
  websiteUrl: string;
};

const getImage = (id: string) => {
  const placeholder = PlaceHolderImages.find(img => img.id === id);
  return {
    url: placeholder?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400',
    hint: placeholder?.imageHint || 'business'
  };
};

export const businesses: Business[] = [
  {
    id: '2',
    name: 'Page Turners',
    category: 'Bookstore',
    distance: '0.5 mi',
    rating: 4.8,
    description: 'An independent bookstore with a curated selection of new and used books. Join our weekly book club!',
    reviews: [
      'My favorite place to get lost in. The staff gives great recommendations.',
      'Found a rare first edition here! What a gem.',
      'A true community hub. I love their author events.',
      'It smells like old books and happiness.',
      'A little dusty in the back corners, but that adds to the charm.',
    ],
    image: getImage('business-2'),
    coordinates: { x: 80, y: 80 },
    whatsapp: '5521999999992',
    websiteUrl: 'https://example.com/page-turners'
  },
  {
    id: '3',
    name: 'Flor de Lótus Móveis',
    category: 'Florist',
    distance: '0.8 mi',
    rating: 4.7,
    description: 'Beautiful, fresh bouquets for any occasion. We offer same-day delivery in the local area.',
    reviews: [
      'The flowers for my wedding were absolutely stunning. Thank you!',
      'A bit pricey, but the quality is unmatched.',
      'Very helpful staff who helped me pick the perfect arrangement.',
    ],
    image: getImage('business-3'),
    coordinates: { x: 65, y: 30 },
    whatsapp: '5521999999993',
    websiteUrl: 'https://example.com/bloom-petal'
  },
  {
    id: '4',
    name: 'The Kneaded Loaf',
    category: 'Bakery',
    distance: '1.2 mi',
    rating: 4.9,
    description: 'Artisanal sourdough, flaky croissants, and decadent cakes. Everything is baked fresh daily.',
    reviews: [
      'The best sourdough I have ever had. Period.',
      'I dream about their chocolate croissants.',
      'Get there early, they sell out fast!',
      'The staff is so friendly and always has a smile.',
    ],
    image: getImage('business-4'),
    coordinates: { x: 25, y: 45 },
    whatsapp: '5521999999994',
    websiteUrl: 'https://example.com/kneaded-loaf'
  },
];

export const getBusinessById = (id: string): Business | undefined => {
  return businesses.find(b => b.id === id);
};

export interface Offer {
  id: string;
  companyId: string;
  businessName: string;
  title: string;
  validUntil: string;
  discount: string;
  description: string;
  couponCode: string;
  terms: string;
  limitPerUser: number;
}


export const businessOffers: Offer[] = [
  {
    id: '1',
    companyId: '1',
    businessName: 'The Daily Grind',
    title: 'Café e Croissant por R$15',
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    discount: '25%',
    description: 'Comece seu dia com um delicioso café e um croissant fresquinho por um preço especial.',
    couponCode: 'CAFECOMAMOR',
    terms: 'Válido de segunda a sexta, das 8h às 11h. Não cumulativo com outras promoções.',
    limitPerUser: 2,
  },
  {
    id: '2',
    companyId: '1',
    businessName: 'The Daily Grind',
    title: 'Happy Hour: 2x1 em Iced Lattes',
    validUntil: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    discount: '50%',
    description: 'Traga um amigo e aproveite nosso Happy Hour de Iced Lattes.',
    couponCode: 'DOSELATTES',
    terms: 'Válido todos os dias, das 16h às 18h.',
    limitPerUser: 5,
  },
  {
    id: '3',
    companyId: '4',
    businessName: 'The Kneaded Loaf',
    title: 'Bolo do Dia com 20% OFF',
    validUntil: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    discount: '20%',
    description: 'Cada dia um bolo diferente com um preço especial para você.',
    couponCode: 'BOLODADIA',
    terms: 'Válido para o bolo do dia. Consultar sabor na loja.',
    limitPerUser: 1,
  },
];

export const getOfferById = (id: string): Offer | undefined => {
    return businessOffers.find(o => o.id === id);
}


export interface Event {
    id: string;
    companyId: string;
    businessName: string;
    title: string;
    date: string;
    description: string;
    limitPerUser: number;
}

export const businessEvents: Event[] = [
    {
        id: 'ev1',
        companyId: '1',
        businessName: 'The Daily Grind',
        title: 'Workshop de Latte Art',
        date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        description: 'Aprenda a fazer desenhos incríveis no seu café! Workshop prático com nosso barista chefe. Vagas limitadas.',
        limitPerUser: 1,
    },
    {
        id: 'ev2',
        companyId: '2',
        businessName: 'Page Turners',
        title: 'Noite de autógrafos com Autor Local',
        date: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
        description: 'Conheça o autor do novo best-seller local, participe de um bate-papo e pegue seu autógrafo.',
        limitPerUser: 2,
    },
     {
        id: 'ev3',
        companyId: '1',
        businessName: 'The Daily Grind',
        title: 'Degustação de Cafés Especiais',
        date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // Expired
        description: 'Uma viagem sensorial pelos melhores grãos do Brasil.',
        limitPerUser: 1,
    },
];

export const getEventById = (id: string): Event | undefined => {
    return businessEvents.find(e => e.id === id);
}


export const categories = [
  { name: 'Saúde', count: 12, icon: HeartPulse, href: '/servicos' },
  { name: 'Imobiliária', count: 8, icon: Store, href: '/servicos' },
  { name: 'Alimentação', count: 24, icon: Utensils, href: '/servicos' },
  { name: 'Serviços', count: 18, icon: Wrench, href: '/servicos' },
  { name: 'Educação', count: 7, icon: Book, href: '/servicos' },
  { name: 'Beleza', count: 15, icon: Sparkles, href: '/servicos' },
  { name: 'Automotivo', count: 11, icon: Car, href: '/servicos' },
  { name: 'Tecnologia', count: 9, icon: Laptop, href: '/servicos' },
  { name: 'Comunicação', count: 5, icon: MessageSquare, href: '/servicos' }
];

export const eventCategories = [
    { name: 'Workshop' },
    { name: 'Música Ao Vivo' },
    { name: 'Degustação' },
    { name: 'Feira' },
    { name: 'Lançamento' },
    { name: 'Outro' },
];


export type Sponsor = {
  id: string;
  name: string;
  icon: React.ElementType;
  link: string;
  linkType: 'internal' | 'external';
  isOccupied: boolean;
};

export const sponsors: Sponsor[] = [
  { id: 's1', name: 'União Construtora', icon: Building, link: '/business/1', linkType: 'internal', isOccupied: true },
  { id: 's2', name: 'Flor de Lótus Móveis', icon: Sparkles, link: '/business/3', linkType: 'internal', isOccupied: true },
  { id: 's3', name: 'Instituto Marina Feld', icon: HeartPulse, link: 'https://instagram.com', linkType: 'external', isOccupied: true },
  { id: 's4', name: 'Bellinha Kids', icon: Car, link: '/business/2', linkType: 'internal', isOccupied: true },
  { id: 's5', name: 'Nova Negócios', icon: Globe, link: 'https://google.com', linkType: 'internal', isOccupied: true },
  { id: 's6', name: 'Clínica Acolher Life', icon: HeartPulse, link: '/business/1', linkType: 'internal', isOccupied: true },
  { id: 's7', name: 'Anuncie Aqui', icon: 'div', link: '#', linkType: 'internal', isOccupied: false },
  { id: 's8', name: 'Anuncie Aqui', icon: 'div', link: '#', linkType: 'internal', isOccupied: false },
  { id: 's9', name: 'Anuncie Aqui', icon: 'div', link: '#', linkType: 'internal', isOccupied: false },
];

export const adminCompanies = [
  {
    id: '1',
    name: 'União Construtora',
    category: 'Construção',
    status: 'Aprovada',
    isActive: true,
    joinDate: '10/07/2024'
  },
  {
    id: '3',
    name: 'Flor de Lótus Móveis',
    category: 'Móveis',
    status: 'Aprovada',
    isActive: true,
    joinDate: '05/07/2024'
  },
  {
    id: 'company-gold',
    name: 'Empresa Gold',
    category: 'Tecnologia',
    status: 'Aprovada',
    isActive: false,
    joinDate: '01/07/2024'
  },
  {
    id: 'company-silver',
    name: 'Empresa Prata',
    category: 'Serviços',
    status: 'Pendente',
    isActive: false,
    joinDate: '28/06/2024'
  },
    {
    id: '5',
    name: 'Nova Hamburgueria',
    category: 'Alimentação',
    status: 'Pendente',
    isActive: false,
    joinDate: '25/06/2024'
  },
  {
    id: '6',
    name: 'Jardim Secreto Flores',
    category: 'Floricultura',
    status: 'Pendente',
    isActive: false,
    joinDate: '22/06/2024'
  }
];

export const adminReviews = [
    {
        id: 'r1',
        companyId: '1',
        companyName: 'União Construtora',
        userId: 'u1',
        userName: 'Carlos Silva',
        userAvatar: 'https://i.pravatar.cc/150?u=carlos',
        rating: 5,
        comment: 'Serviço impecável! A equipe da União Construtora foi extremamente profissional e entregou minha obra antes do prazo. Recomendo de olhos fechados.',
        date: '24/07/2024'
    },
    {
        id: 'r2',
        companyId: '3',
        companyName: 'Flor de Lótus Móveis',
        userId: 'u2',
        userName: 'Ana Paula',
        userAvatar: 'https://i.pravatar.cc/150?u=ana',
        rating: 1,
        comment: 'Péssima experiência. O sofá que comprei veio com defeito e a loja se recusou a trocar. O atendimento pós-venda é horrível. Não comprem aqui!',
        date: '23/07/2024'
    },
     {
        id: 'r3',
        companyId: 'company-gold',
        companyName: 'Empresa Gold',
        userId: 'u3',
        userName: 'Pedro Martins',
        userAvatar: 'https://i.pravatar.cc/150?u=pedro',
        rating: 4,
        comment: 'O software é muito bom, mas o suporte técnico poderia ser um pouco mais ágil para resolver problemas complexos. No geral, estou satisfeito.',
        date: '22/07/2024'
    },
    {
        id: 'r4',
        companyId: '1',
        companyName: 'União Construtora',
        userId: 'u4',
        userName: 'Fernanda Lima',
        userAvatar: 'https://i.pravatar.cc/150?u=fernanda',
        rating: 5,
        comment: 'Construí minha casa com eles e foi a melhor decisão. Qualidade, pontualidade e um ótimo preço. Superou minhas expectativas!',
        date: '21/07/2024'
    }
];

export const categorySuggestions = [
    { name: 'Pet Shop' },
    { name: 'Barbearia' },
    { name: 'Consultoria de TI' },
];

export const activeCategories = [
    { name: 'Saúde', count: 12 },
    { name: 'Imobiliária', count: 8 },
    { name: 'Alimentação', count: 24 },
    { name: 'Serviços', count: 18 },
    { name: 'Educação', count: 7 },
    { name: 'Beleza', count: 15 },
    { name: 'Automotivo', count: 11 },
    { name: 'Tecnologia', count: 9 },
];
