import { TestBed } from '@angular/core/testing';
import { QueryHttpService } from './query-http.service';
import { MOCK_QUERIES } from './mocked-data/queries.data';
import { Query } from '../models/query.interface';

describe(QueryHttpService.name, () => {
  let service: QueryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryHttpService],
    });
    service = TestBed.inject(QueryHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all queries', (done) => {
      service.getAll().subscribe((queries) => {
        expect(queries).toEqual(MOCK_QUERIES);
        expect(queries.length).toBe(MOCK_QUERIES.length);
        done();
      });
    });

    it('should return queries with correct structure', (done) => {
      service.getAll().subscribe((queries) => {
        queries.forEach((query) => {
          expect(query).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              apiId: expect.any(String),
              interval: expect.any(Number),
              parameters: expect.any(Array),
              selectedAttributes: expect.any(Array),
              isActive: expect.any(Boolean),
            })
          );
        });
        done();
      });
    });
  });

  describe('create', () => {
    it('should create a new query', (done) => {
      const newQuery: Query = {
        id: '3',
        name: 'New Test Query',
        apiId: 'test-api',
        interval: 120000,
        parameters: [{ name: 'test', value: 'value' }],
        selectedAttributes: ['attr1', 'attr2'],
        isActive: true,
      };

      service.create(newQuery).subscribe((createdQuery) => {
        expect(createdQuery).toEqual(newQuery);

        // Verify query was added to the list
        service.getAll().subscribe((queries) => {
          expect(queries).toContainEqual(newQuery);
          expect(queries.length).toBe(MOCK_QUERIES.length + 1);
          done();
        });
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing query', (done) => {
      const queryToDelete = MOCK_QUERIES[0];
      const originalLength = MOCK_QUERIES.length;

      service.delete(queryToDelete.id).subscribe(() => {
        service.getAll().subscribe((queries) => {
          expect(queries.length).toBe(originalLength - 1);
          expect(
            queries.find((q) => q.id === queryToDelete.id)
          ).toBeUndefined();
          done();
        });
      });
    });

    it('should throw error when deleting non-existent query', () => {
      expect(() => service.delete('non-existent-id')).toThrow(
        'Query with id non-existent-id not found'
      );
    });
  });
});
