import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QueryHttpService } from './query-http.service';
import { MOCK_QUERIES } from './mocked-data/queries.data';
import { Query } from '../models/query.interface';
import { environment } from '../../../environments/environment';

describe(QueryHttpService.name, () => {
  let service: QueryHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QueryHttpService],
    });
    service = TestBed.inject(QueryHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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

      const req = httpMock.expectOne(`${environment.apiUrl}/queries`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_QUERIES);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/queries`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_QUERIES);
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
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/queries`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newQuery);
      req.flush(newQuery);
    });
  });

  describe('delete', () => {
    it('should delete a query', (done) => {
      const queryId = 'test-id';

      service.delete(queryId).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/queries/${queryId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle 404 when deleting non-existent query', (done) => {
      const queryId = 'non-existent-id';

      service.delete(queryId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/queries/${queryId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Query not found', { 
        status: 404, 
        statusText: 'Not Found'
      });
    });
  });
});
