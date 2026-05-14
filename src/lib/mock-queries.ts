import { categories, events } from '@/data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMockEvents() {
  await delay(60);
  return events;
}

export async function fetchMockCategories() {
  await delay(60);
  return categories;
}
