import type { Category } from '@/types';

export const CORE_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Música',
    icon: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    color: '#2563EB',
  },
  {
    id: 2,
    name: 'Tecnologia',
    icon: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    color: '#8b5cf6',
  },
  {
    id: 3,
    name: 'Esportes',
    icon: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400',
    color: '#10b981',
  },
];

const categoryByName = new Map(
  CORE_CATEGORIES.map((category) => [category.name.toLowerCase(), category]),
);

export function getCategoryByName(name: string): Category | undefined {
  return categoryByName.get(name.toLowerCase());
}

export function resolveCategories(apiCategories: Category[] = []): Category[] {
  return CORE_CATEGORIES.map((core) => {
    const fromApi = apiCategories.find(
      (category) => category.name.toLowerCase() === core.name.toLowerCase(),
    );
    return fromApi ? { ...core, id: fromApi.id } : core;
  });
}
