import { categories, events } from '@/data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simula chamada de API com dados mockados (substituir por fetch real depois). */
export async function fetchMockEvents() {
  await delay(450);
  return events;
}

export async function fetchMockCategories() {
  await delay(150);
  return categories;
}
