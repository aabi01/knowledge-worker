import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { QueryResult } from '../models/query-result.interface';

interface QueryResultsState {
  [queryId: string]: QueryResult[];
}

@Injectable({
  providedIn: 'root',
})
export class QueryResultsService {
  private readonly MAX_RESULTS_PER_QUERY = 100;
  private state = new BehaviorSubject<QueryResultsState>({});

  /**
   * Store a new result for a query
   * @param result The query result to store
   */
  storeResult(result: QueryResult): void {
    const currentState = this.state.value;
    const queryResults = currentState[result.queryId] || [];

    // Add new result at the beginning of the array
    const updatedResults = [result, ...queryResults];

    // Limit the number of stored results
    const limitedResults = updatedResults.slice(0, this.MAX_RESULTS_PER_QUERY);

    this.state.next({
      ...currentState,
      [result.queryId]: limitedResults,
    });
  }

  /**
   * Get the latest result for a specific query
   * @param queryId The ID of the query
   * @returns Observable of the latest result or undefined if none exists
   */
  getLatestResult(queryId: string): Observable<QueryResult | undefined> {
    return this.state.pipe(map((state) => state[queryId]?.[0]));
  }

  /**
   * Clear all stored results
   */
  clearAllResults(): void {
    this.state.next({});
  }
}
