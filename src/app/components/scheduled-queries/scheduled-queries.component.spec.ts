import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ScheduledQueriesComponent } from './scheduled-queries.component';
import { QueryService } from '../../core/services/query.service';
import { QuerySchedulerService } from '../../core/services/query-scheduler.service';
import { QueryResultsService } from '../../core/store/query-results.service';
import { Dialog } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { QueryResult } from '../../core/models/query-result.interface';
import { of } from 'rxjs';
import { AddQueryDialogComponent } from '../add-query-dialog/add-query-dialog.component';
import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';
import { ShowQueryResultDialogComponent } from '../show-query-result-dialog/show-query-result-dialog.component';

describe(ScheduledQueriesComponent.name, () => {
  let component: ScheduledQueriesComponent;
  let fixture: ComponentFixture<ScheduledQueriesComponent>;
  let queryService: jest.Mocked<QueryService>;
  let queryScheduler: jest.Mocked<QuerySchedulerService>;
  let queryResults: jest.Mocked<QueryResultsService>;
  let dialog: jest.Mocked<Dialog>;

  const mockQuery: Query = {
    id: 'test-query',
    name: 'Test Query',
    apiId: 'test-api',
    interval: 60000,
    parameters: [{ name: 'param1', value: 'value1' }],
    selectedAttributes: ['attr1', 'attr2'],
    isActive: true,
  };

  const mockResult: QueryResult = {
    queryId: mockQuery.id,
    timestamp: new Date(),
    data: [{ test: 'data' }],
    status: 'success',
  };

  beforeEach(async () => {
    const mockQueryService = {
      getQueries: jest.fn(),
      deleteQuery: jest.fn(),
    };

    const mockQueryScheduler = {
      startQuery: jest.fn(),
      stopQuery: jest.fn(),
      stopAllQueries: jest.fn(),
    };

    const mockQueryResults = {
      getLatestResult: jest.fn(),
    };

    const mockDialog = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ScheduledQueriesComponent],
      providers: [
        { provide: QueryService, useValue: mockQueryService },
        { provide: QuerySchedulerService, useValue: mockQueryScheduler },
        { provide: QueryResultsService, useValue: mockQueryResults },
        { provide: Dialog, useValue: mockDialog },
      ],
    }).compileComponents();

    queryService = TestBed.inject(QueryService) as jest.Mocked<QueryService>;
    queryScheduler = TestBed.inject(
      QuerySchedulerService
    ) as jest.Mocked<QuerySchedulerService>;
    queryResults = TestBed.inject(
      QueryResultsService
    ) as jest.Mocked<QueryResultsService>;
    dialog = TestBed.inject(Dialog) as jest.Mocked<Dialog>;

    queryService.getQueries.mockReturnValue(of([mockQuery]));
    dialog.open.mockReturnValue({
      closed: of(undefined),
    } as any);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledQueriesComponent);
    component = fixture.componentInstance;
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should start active queries on initialization', () => {
      fixture.detectChanges();

      expect(queryScheduler.startQuery).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('onAddQuery', () => {
    it('should open add query dialog', () => {
      component.onAddQuery();

      expect(dialog.open).toHaveBeenCalledWith(AddQueryDialogComponent);
    });

    it('should start query if active query is added', () => {
      dialog.open.mockReturnValue({
        closed: of(mockQuery),
      } as any);

      component.onAddQuery();

      expect(queryScheduler.startQuery).toHaveBeenCalledWith(mockQuery);
      expect(queryService.getQueries).toHaveBeenCalled();
    });
  });

  describe('onRemoveQuery', () => {
    it('should open confirm dialog', () => {
      component.onRemoveQuery(mockQuery);

      expect(dialog.open).toHaveBeenCalledWith(ConfirmActionDialogComponent, {
        data: {
          title: 'Delete Query',
          message: `Are you sure you want to delete the query "${mockQuery.name}"?`,
          confirmLabel: 'Delete',
          cancelLabel: 'Keep',
        },
        hasBackdrop: false,
      });
    });

    it('should delete query when confirmed', fakeAsync(() => {
      dialog.open.mockReturnValue({
        closed: of(true),
      } as any);
      queryService.deleteQuery.mockReturnValue(of(undefined));

      component.onRemoveQuery(mockQuery);
      tick();

      expect(queryScheduler.stopQuery).toHaveBeenCalledWith(mockQuery.id);
      expect(queryService.deleteQuery).toHaveBeenCalledWith(mockQuery.id);
      expect(queryService.getQueries).toHaveBeenCalled();
    }));
  });

  describe('onShowResults', () => {
    it('should show results when available', async () => {
      queryResults.getLatestResult.mockReturnValue(of(mockResult));

      await component.onShowResults(mockQuery);

      expect(dialog.open).toHaveBeenCalledWith(ShowQueryResultDialogComponent, {
        data: { query: mockQuery, result: mockResult },
      });
    });

    it('should show no results message when no results available', async () => {
      queryResults.getLatestResult.mockReturnValue(of(undefined));

      await component.onShowResults(mockQuery);

      expect(dialog.open).toHaveBeenCalledWith(ShowQueryResultDialogComponent, {
        data: {
          query: mockQuery,
          result: {
            queryId: mockQuery.id,
            timestamp: expect.any(Date),
            data: [],
            error:
              'No results available yet. The query may still be executing.',
          },
        },
      });
    });
  });

  describe('formatting methods', () => {
    it('should format interval in minutes when less than an hour', () => {
      const result = component.formatInterval(30 * 60000); // 30 minutes
      expect(result).toBe('30 minutes');
    });

    it('should format interval in hours', () => {
      const result = component.formatInterval(2 * 60 * 60000); // 2 hours
      expect(result).toBe('2 hours');
    });

    it('should format interval for one hour', () => {
      const result = component.formatInterval(60 * 60000); // 1 hour
      expect(result).toBe('1 hour');
    });

    it('should format parameters', () => {
      const result = component.formatParameters([
        { name: 'param1', value: 'value1' },
        { name: 'param2', value: 'value2' },
      ]);
      expect(result).toBe('param1: value1, param2: value2');
    });

    it('should format attributes', () => {
      const result = component.formatAttributes(['attr1', 'attr2', 'attr3']);
      expect(result).toBe('attr1, attr2, attr3');
    });
  });

  describe('ngOnDestroy', () => {
    it('should stop all queries', () => {
      component.ngOnDestroy();
      expect(queryScheduler.stopAllQueries).toHaveBeenCalled();
    });
  });
});
