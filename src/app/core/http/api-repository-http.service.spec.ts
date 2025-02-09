import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiRepositoryHttpService } from './api-repository-http.service';
import { MOCKED_APIS } from './mocked-data/apis.data';
import { environment } from '../../../environments/environment';

describe(ApiRepositoryHttpService.name, () => {
  let service: ApiRepositoryHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiRepositoryHttpService],
    });
    service = TestBed.inject(ApiRepositoryHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableApis', () => {
    it('should return all available APIs', (done) => {
      service.getAvailableApis().subscribe((apis) => {
        expect(apis).toEqual(MOCKED_APIS);
        expect(apis.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api-repository`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCKED_APIS);
    });

    it('should return APIs with correct structure', (done) => {
      service.getAvailableApis().subscribe((apis) => {
        expect(apis[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            parameters: expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                type: expect.any(String),
                description: expect.any(String),
                required: expect.any(Boolean),
              }),
            ]),
            availableAttributes: expect.arrayContaining([expect.any(String)]),
          })
        );
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api-repository`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCKED_APIS);
    });

    it('should handle empty response', (done) => {
      service.getAvailableApis().subscribe((apis) => {
        expect(apis).toEqual([]);
        expect(apis.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api-repository`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle error response', (done) => {
      service.getAvailableApis().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api-repository`);
      expect(req.request.method).toBe('GET');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('getApiById', () => {
    it('should return a specific API by ID', (done) => {
      const mockApi = MOCKED_APIS[0];

      service.getApiById(mockApi.id).subscribe((api) => {
        expect(api).toEqual(mockApi);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/api-repository/${mockApi.id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockApi);
    });

    it('should handle 404 for non-existent API ID', (done) => {
      const nonExistentId = 'non-existent-id';

      service.getApiById(nonExistentId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/api-repository/${nonExistentId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush('API not found', {
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should handle server error', (done) => {
      const apiId = 'test-api';

      service.getApiById(apiId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          done();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/api-repository/${apiId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
