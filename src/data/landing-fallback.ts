import type { Category, Event } from '@/types';
import { CORE_CATEGORIES } from '@/lib/categories';

export const fallbackCategories: Category[] = CORE_CATEGORIES;

export const fallbackFeaturedEvents: Event[] = [
  {
    id: 1,
    title: 'Festival de Música Eletrônica 2026',
    description:
      'O maior festival de música eletrônica da região com DJs internacionais e nacionais. Uma experiência única com 3 palcos simultâneos.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'Música',
    date: '2026-06-15',
    time: '20:00',
    location: 'Parque Villa-Lobos, São Paulo - SP',
    organizer: 'Maria Silva',
    organizerId: 1,
    price: 150,
    capacity: 5000,
    confirmed: 3420,
    status: 'upcoming',
    rating: 4.8,
    reviews: 234,
    featured: true,
  },
  {
    id: 2,
    title: 'Tech Summit Brazil 2026',
    description:
      'Conferência anual sobre tecnologia, inovação e transformação digital. Palestrantes renomados do mercado tech brasileiro.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'Tecnologia',
    date: '2026-07-20',
    time: '09:00',
    location: 'Centro de Convenções Frei Caneca, São Paulo - SP',
    organizer: 'João Santos',
    organizerId: 2,
    price: 300,
    capacity: 1000,
    confirmed: 847,
    status: 'upcoming',
    rating: 4.9,
    reviews: 156,
    featured: true,
  },
  {
    id: 3,
    title: 'Maratona de São Paulo',
    description:
      'Corrida oficial de 42km pelas principais avenidas da cidade. Participe do maior evento de corrida da América Latina.',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    category: 'Esportes',
    date: '2026-08-10',
    time: '06:00',
    location: 'Av. Paulista, São Paulo - SP',
    organizer: 'Carlos Oliveira',
    organizerId: 3,
    price: 80,
    capacity: 30000,
    confirmed: 28500,
    status: 'upcoming',
    rating: 4.7,
    reviews: 892,
    featured: true,
  },
];
