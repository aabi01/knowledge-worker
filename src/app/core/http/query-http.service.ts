import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Query } from '../models/query.interface';
import { MOCK_QUERIES } from './mocked-data/queries.data';

@Injectable({
  providedIn: 'root',
})
export class QueryHttpService {
  private queries: Query[] = MOCK_QUERIES;

  /**
   * Get all available queries
   * @returns Observable of Query array
   */
  getAll(): Observable<Query[]> {
    return of(this.queries);
  }

  /**
   * Create a new query
   * @param query Query data to create
   * @returns Observable of created Query
   */
  create(query: Query): Observable<Query> {
    this.queries = [...this.queries, query];
    return of(query);
  }

  /**
   * Update an existing query
   * @param id Query ID
   * @param updates Partial query updates
   * @returns Observable of updated Query
   */
  update(id: string, updates: Partial<Query>): Observable<Query> {
    const index = this.queries.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`Query with id ${id} not found`);
    }

    const updatedQuery = { ...this.queries[index], ...updates };
    this.queries = [
      ...this.queries.slice(0, index),
      updatedQuery,
      ...this.queries.slice(index + 1),
    ];

    return of(updatedQuery);
  }

  /**
   * Delete a query
   * @param id Query ID
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    const index = this.queries.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`Query with id ${id} not found`);
    }

    this.queries = [
      ...this.queries.slice(0, index),
      ...this.queries.slice(index + 1),
    ];

    return of(void 0);
  }
}
