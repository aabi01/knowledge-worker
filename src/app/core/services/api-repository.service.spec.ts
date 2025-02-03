import { TestBed } from '@angular/core/testing';
import { ApiRepositoryService } from './api-repository.service';
import { ApiRepositoryHttpService } from '../http/api-repository-http.service';
import { MOCKED_APIS } from '../http/mocked-data/apis.data';
import { Observable, throwError } from 'rxjs';
import { Api } from '../models/api.interface';

describe(ApiRepositoryService.name, () => {
  let service: ApiRepositoryService;
  let httpService: jest.Mocked<ApiRepositoryHttpService>;

  beforeEach(() => {
    // Create mock for HttpService
    const mockHttpService = {
      getAvailableApis: jest.fn(),
      getApiById: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ApiRepositoryService,
        { provide: ApiRepositoryHttpService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(ApiRepositoryService);
    httpService = TestBed.inject(
      ApiRepositoryHttpService
    ) as jest.Mocked<ApiRepositoryHttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getApis', () => {
    it('should return APIs from HTTP service', (done) => {
      httpService.getAvailableApis.mockReturnValue(
        new Observable((subscriber) => {
          subscriber.next(MOCKED_APIS);
          subscriber.complete();
        })
      );

      service.getApis().subscribe((apis) => {
        expect(apis).toEqual(MOCKED_APIS);
        expect(httpService.getAvailableApis).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should return empty array on error', (done) => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      httpService.getAvailableApis.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      service.getApis().subscribe((apis) => {
        expect(apis).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching APIs:',
          expect.any(Error)
        );
        consoleErrorSpy.mockRestore();
        done();
      });
    });
  });

  describe('getApiById', () => {
    const testApiId = 'test-api-id';

    it('should return specific API from HTTP service', (done) => {
      const expectedApi: Api = MOCKED_APIS[0];
      httpService.getApiById.mockReturnValue(
        new Observable((subscriber) => {
          subscriber.next(expectedApi);
          subscriber.complete();
        })
      );

      service.getApiById(testApiId).subscribe((api) => {
        expect(api).toEqual(expectedApi);
        expect(httpService.getApiById).toHaveBeenCalledWith(testApiId);
        expect(httpService.getApiById).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should return undefined on error', (done) => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      httpService.getApiById.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      service.getApiById(testApiId).subscribe((api) => {
        expect(api).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching API with id test-api-id:',
          expect.any(Error)
        );
        consoleErrorSpy.mockRestore();
        done();
      });
    });

    it('should handle undefined API response', (done) => {
      httpService.getApiById.mockReturnValue(
        new Observable((subscriber) => {
          subscriber.next(undefined);
          subscriber.complete();
        })
      );

      service.getApiById('non-existent-id').subscribe((api) => {
        expect(api).toBeUndefined();
        expect(httpService.getApiById).toHaveBeenCalledWith('non-existent-id');
        done();
      });
    });
  });
});
