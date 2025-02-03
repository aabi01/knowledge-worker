import { TestBed } from '@angular/core/testing';
import { QueryService } from './query.service';
import { QueryHttpService } from '../http/query-http.service';
import { Query } from '../models/query.interface';
import { of, throwError } from 'rxjs';
import { MOCK_QUERIES } from '../http/mocked-data/queries.data';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

describe(QueryService.name, () => {
  let service: QueryService;
  let httpService: jest.Mocked<QueryHttpService>;

  const mockQueries = MOCK_QUERIES;
  const mockUUID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    const mockHttpService = {
      getAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        QueryService,
        { provide: QueryHttpService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(QueryService);
    httpService = TestBed.inject(
      QueryHttpService
    ) as jest.Mocked<QueryHttpService>;

    // Default mock implementation
    httpService.getAll.mockReturnValue(of(mockQueries));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQueries', () => {
    it('should return all queries from HTTP service', (done) => {
      service.getQueries().subscribe((queries) => {
        expect(queries).toEqual(mockQueries);
        expect(httpService.getAll).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('getQueryById', () => {
    it('should return a query by ID', (done) => {
      const targetQuery = mockQueries[0];

      service.getQueryById(targetQuery.id).subscribe((query) => {
        expect(query).toEqual(targetQuery);
        expect(httpService.getAll).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw error when query not found', (done) => {
      service.getQueryById('non-existent-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Query with id non-existent-id not found');
          done();
        },
      });
    });
  });

  describe('createQuery', () => {
    it('should create a new query with generated ID', (done) => {
      const queryData: Omit<Query, 'id'> = {
        name: 'New Test Query',
        apiId: 'test-api',
        interval: 120000,
        parameters: [{ name: 'test', value: 'value' }],
        selectedAttributes: ['attr1', 'attr2'],
        isActive: true,
      };

      const expectedQuery: Query = {
        ...queryData,
        id: mockUUID,
        lastExecuted: undefined,
      };

      httpService.create.mockImplementation((query) => of(query));

      service.createQuery(queryData).subscribe((createdQuery) => {
        expect(createdQuery).toMatchObject(expectedQuery);
        expect(createdQuery.id).toBe(mockUUID);
        done();
      });
    });
  });

  describe('deleteQuery', () => {
    it('should delete a query by ID', (done) => {
      const queryId = mockQueries[0].id;
      httpService.delete.mockReturnValue(of(void 0));

      service.deleteQuery(queryId).subscribe(() => {
        expect(httpService.delete).toHaveBeenCalledWith(queryId);
        done();
      });
    });

    it('should propagate error when deleting non-existent query', (done) => {
      const error = new Error('Query not found');
      httpService.delete.mockReturnValue(throwError(() => error));

      service.deleteQuery('non-existent-id').subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });
});
