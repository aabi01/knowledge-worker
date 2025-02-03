import { TestBed } from '@angular/core/testing';
import { QueryResultsService } from './query-results.service';
import { QueryResult } from '../models/query-result.interface';

describe(QueryResultsService.name, () => {
  let service: QueryResultsService;

  const createMockResult = (
    queryId: string,
    timestamp: Date = new Date(),
    status: 'success' | 'error' = 'success'
  ): QueryResult => ({
    queryId,
    timestamp,
    data: [{ title: 'Test Item', author: 'Test Author' }],
    status,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryResultsService],
    });
    service = TestBed.inject(QueryResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('storeResult', () => {
    it('should store a new result', (done) => {
      const result = createMockResult('query1');

      service.storeResult(result);
      service.getLatestResult('query1').subscribe((storedResult) => {
        expect(storedResult).toEqual(result);
        done();
      });
    });

    it('should store results in reverse chronological order', (done) => {
      const oldResult = createMockResult('query1', new Date('2025-01-01'));
      const newResult = createMockResult('query1', new Date('2025-02-01'));

      service.storeResult(oldResult);
      service.storeResult(newResult);

      service.getLatestResult('query1').subscribe((latestResult) => {
        expect(latestResult).toEqual(newResult);
        done();
      });
    });

    it('should handle multiple queries independently', (done) => {
      const result1 = createMockResult('query1');
      const result2 = createMockResult('query2');

      service.storeResult(result1);
      service.storeResult(result2);

      service.getLatestResult('query1').subscribe((storedResult1) => {
        expect(storedResult1).toEqual(result1);
        service.getLatestResult('query2').subscribe((storedResult2) => {
          expect(storedResult2).toEqual(result2);
          done();
        });
      });
    });
  });

  describe('getLatestResult', () => {
    it('should return undefined for non-existent query', (done) => {
      service.getLatestResult('non-existent').subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return the most recent result', (done) => {
      const results = [
        createMockResult('query1', new Date('2025-01-01')),
        createMockResult('query1', new Date('2025-02-01')),
        createMockResult('query1', new Date('2025-03-01')),
      ];

      results.forEach((result) => service.storeResult(result));

      service.getLatestResult('query1').subscribe((latestResult) => {
        expect(latestResult).toEqual(results[2]); // Most recent result
        done();
      });
    });
  });

  describe('clearAllResults', () => {
    it('should remove all stored results', (done) => {
      // Store some results
      service.storeResult(createMockResult('query1'));
      service.storeResult(createMockResult('query2'));

      // Clear all results
      service.clearAllResults();

      // Verify both queries return undefined
      service.getLatestResult('query1').subscribe((result1) => {
        expect(result1).toBeUndefined();
        service.getLatestResult('query2').subscribe((result2) => {
          expect(result2).toBeUndefined();
          done();
        });
      });
    });

    it('should handle clearing empty state', (done) => {
      service.clearAllResults(); // Clear when already empty
      service.getLatestResult('query1').subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });

  describe('error handling', () => {
    it('should store error results', (done) => {
      const errorResult: QueryResult = {
        queryId: 'query1',
        timestamp: new Date(),
        data: [],
        status: 'error',
        error: 'Test error message',
      };

      service.storeResult(errorResult);
      service.getLatestResult('query1').subscribe((result) => {
        expect(result).toEqual(errorResult);
        expect(result?.status).toBe('error');
        expect(result?.error).toBe('Test error message');
        done();
      });
    });
  });
});
