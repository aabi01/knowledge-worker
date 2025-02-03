import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApiRepositoryHttpService } from './api-repository-http.service';
import { MOCKED_APIS } from './mocked-data/apis.data';
import { Api } from '../models/api.interface';

describe(ApiRepositoryHttpService.name, () => {
  let service: ApiRepositoryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiRepositoryHttpService],
    });
    service = TestBed.inject(ApiRepositoryHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableApis', () => {
    it('should return all available APIs after 500ms delay', fakeAsync(() => {
      let apis: Api[] | undefined;

      service.getAvailableApis().subscribe((result) => {
        apis = result;
      });

      // No result before delay
      expect(apis).toBeUndefined();

      // Fast-forward time by 500ms
      tick(500);

      expect(apis).toEqual(MOCKED_APIS);
      expect(apis?.length).toBe(2);
    }));

    it('should return APIs with correct structure', fakeAsync(() => {
      let apis: Api[] | undefined;

      service.getAvailableApis().subscribe((result) => {
        apis = result;
      });

      tick(500);

      expect(apis?.[0]).toEqual(
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
    }));
  });

  describe('getApiById', () => {
    it('should return specific API by ID after 300ms delay', fakeAsync(() => {
      let api: Api | undefined;

      service.getApiById('books-api').subscribe((result) => {
        api = result;
      });

      // No result before delay
      expect(api).toBeUndefined();

      // Fast-forward time by 300ms
      tick(300);

      expect(api).toEqual(MOCKED_APIS[0]);
      expect(api?.id).toBe('books-api');
    }));

    it('should return undefined for non-existent API ID', fakeAsync(() => {
      let api: Api | undefined;

      service.getApiById('non-existent-id').subscribe((result) => {
        api = result;
      });

      tick(300);

      expect(api).toBeUndefined();
    }));

    it('should handle movies-api ID correctly', fakeAsync(() => {
      let api: Api | undefined;

      service.getApiById('movies-api').subscribe((result) => {
        api = result;
      });

      tick(300);

      expect(api).toEqual(MOCKED_APIS[1]);
      expect(api?.id).toBe('movies-api');
      expect(api?.name).toBe('Movies API');
    }));
  });
});
