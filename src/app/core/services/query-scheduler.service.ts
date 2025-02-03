import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  interval,
  startWith,
} from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Query } from '../models/query.interface';
import { QueryResult } from '../models/query-result.interface';
import { QueryExecutionService } from './query-execution.service';

interface ActiveQuery {
  query: Query;
  subscription?: Subscription;
  lastExecuted?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class QuerySchedulerService implements OnDestroy {
  private activeQueries = new BehaviorSubject<ActiveQuery[]>([]);
  private destroy$ = new Subject<void>();

  constructor(private queryExecution: QueryExecutionService) {}

  ngOnDestroy() {
    this.stopAllQueries();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Start executing a query at its specified interval
   * @param query The query to schedule
   */
  startQuery(query: Query): void {
    // Stop the query if it's already running
    this.stopQuery(query.id);

    const activeQuery: ActiveQuery = {
      query,
      lastExecuted: undefined,
    };

    // Create subscription for periodic execution
    activeQuery.subscription = interval(query.interval)
      .pipe(
        // Start immediately, then follow interval
        startWith(0),
        // Only execute if query is active
        filter(() => query.isActive),
        // Execute the query
        switchMap(() => this.queryExecution.executeQuery(query)),
        // Stop when service is destroyed
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result: QueryResult) => {
          // Update last executed time
          const currentQueries = this.activeQueries.value;
          const updatedQueries = currentQueries.map((q) => {
            if (q.query.id === query.id) {
              return {
                ...q,
                lastExecuted: result.timestamp,
              };
            }
            return q;
          });
          this.activeQueries.next(updatedQueries);
        },
        error: (error) => {
          console.error(`Error executing query ${query.id}:`, error);
          // Don't stop the query on error, let it retry on next interval
        },
      });

    // Add to active queries
    this.activeQueries.next([...this.activeQueries.value, activeQuery]);
  }

  /**
   * Stop executing a scheduled query
   * @param queryId The ID of the query to stop
   */
  stopQuery(queryId: string): void {
    const currentQueries = this.activeQueries.value;
    const queryToStop = currentQueries.find((q) => q.query.id === queryId);

    if (queryToStop?.subscription) {
      queryToStop.subscription.unsubscribe();
    }

    this.activeQueries.next(
      currentQueries.filter((q) => q.query.id !== queryId)
    );
  }

  /**
   * Stop all scheduled queries
   */
  stopAllQueries(): void {
    const currentQueries = this.activeQueries.value;
    currentQueries.forEach((query) => {
      if (query.subscription) {
        query.subscription.unsubscribe();
      }
    });
    this.activeQueries.next([]);
  }
}
