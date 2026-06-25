import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    service = new CategoriesService();
  });

  it('should return the categories expected by the frontend', () => {
    expect(service.findAll()).toEqual([
      expect.objectContaining({ id: 1, name: 'Música' }),
      expect.objectContaining({ id: 2, name: 'Tecnologia' }),
      expect.objectContaining({ id: 3, name: 'Esportes' }),
    ]);
  });
});