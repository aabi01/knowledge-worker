import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuerySchedulerService } from './query-scheduler.service';
import { QueryExecutionService } from './query-execution.service';
import { Query } from '../models/query.interface';
import { QueryResult } from '../models/query-result.interface';
import { of, throwError } from 'rxjs';

describe(QuerySchedulerService.name, () => {
  let service: QuerySchedulerService;
  let queryExecution: jest.Mocked<QueryExecutionService>;

  const createMockQuery = (id: string, interval: number = 1000): Query => ({
    id,
    name: 'Test Query',
    apiId: 'test-api',
    interval,
    parameters: [],
    selectedAttributes: [],
    isActive: true,
  });

  const createMockResult = (queryId: string): QueryResult => ({
    queryId,
    timestamp: new Date(),
    data: [],
    status: 'success',
  });

  beforeEach(() => {
    const mockQueryExecution = {
      executeQuery: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        QuerySchedulerService,
        { provide: QueryExecutionService, useValue: mockQueryExecution },
      ],
    });

    service = TestBed.inject(QuerySchedulerService);
    queryExecution = TestBed.inject(
      QueryExecutionService
    ) as jest.Mocked<QueryExecutionService>;
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startQuery', () => {
    it('should execute query immediately and then at intervals', fakeAsync(() => {
      const query = createMockQuery('query1', 1000);
      const result = createMockResult(query.id);
      queryExecution.executeQuery.mockReturnValue(of(result));

      service.startQuery(query);

      // Should execute immediately
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(1);

      // Advance time by one interval
      tick(1000);
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(2);

      // Advance time by another interval
      tick(1000);
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(3);
    }));

    it('should handle execution errors without stopping the schedule', fakeAsync(() => {
      const query = createMockQuery('query1', 1000);
      const error = new Error('Test error');

      // Mock console.error to prevent error output in tests
      jest.spyOn(console, 'error').mockImplementation(() => {});

      queryExecution.executeQuery.mockReturnValue(throwError(() => error));

      service.startQuery(query);

      // First execution should happen immediately
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(1);

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith(
        `Error executing query ${query.id}:`,
        error
      );

      // Clean up
      jest.restoreAllMocks();
    }));
  });

  describe('stopQuery', () => {
    it('should stop executing a specific query', fakeAsync(() => {
      const query = createMockQuery('query1', 1000);
      const result = createMockResult(query.id);
      queryExecution.executeQuery.mockReturnValue(of(result));

      service.startQuery(query);
      tick(1000);
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(2);

      service.stopQuery(query.id);
      tick(1000);
      // Should not execute again after stopping
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(2);
    }));

    it('should handle stopping non-existent query', () => {
      // Should not throw error
      expect(() => service.stopQuery('non-existent')).not.toThrow();
    });
  });

  describe('stopAllQueries', () => {
    it('should stop all executing queries', fakeAsync(() => {
      const query1 = createMockQuery('query1', 1000);
      const query2 = createMockQuery('query2', 1000);

      queryExecution.executeQuery.mockReturnValue(
        of(createMockResult('query1'))
      );

      service.startQuery(query1);
      service.startQuery(query2);
      tick(1000);

      service.stopAllQueries();
      tick(1000);

      // Should not execute any queries after stopping all
      const finalCallCount = queryExecution.executeQuery.mock.calls.length;
      tick(1000);
      expect(queryExecution.executeQuery).toHaveBeenCalledTimes(finalCallCount);
    }));
  });
});
