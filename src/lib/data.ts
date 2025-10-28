import { PlaceHolderImages } from './placeholder-images';

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
    id: '1',
    name: 'The Daily Grind',
    category: 'Coffee Shop',
    distance: '0.2 mi',
    rating: 4.5,
    description: 'A cozy spot for your daily dose of caffeine. We serve locally roasted beans and freshly baked pastries.',
    reviews: [
      'Amazing atmosphere and the best cold brew in town!',
      'Pastries are a bit overpriced, but the coffee is worth it.',
      'A bit crowded in the mornings, but the service is fast.',
      'I love their loyalty program. Great place to work from.',
    ],
    image: getImage('business-1'),
    coordinates: { x: 40, y: 70 },
  },
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
  },
  {
    id: '3',
    name: 'Bloom & Petal',
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
