import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Query } from '../models/query.interface';
import { QueryHttpService } from '../http/query-http.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  constructor(private http: QueryHttpService) {}

  /**
   * Get all queries
   * @returns Observable<Query[]>
   */
  getQueries(): Observable<Query[]> {
    return this.http.getAll();
  }

  /**
   * Get a query by ID
   * @param id Query ID
   * @returns Observable<Query>
   */
  getQueryById(id: string): Observable<Query> {
    return this.http.getAll().pipe(
      map((queries) => {
        const query = queries.find((q) => q.id === id);
        if (!query) {
          throw new Error(`Query with id ${id} not found`);
        }
        return query;
      })
    );
  }

  /**
   * Create a new query
   * @param query Query data without ID
   * @returns Observable<Query>
   */
  createQuery(query: Omit<Query, 'id'>): Observable<Query> {
    const newQuery: Query = {
      ...query,
      id: uuidv4(), // Generate a unique ID using uuid package
      lastExecuted: undefined, // New queries haven't been executed yet
    };

    return this.http.create(newQuery);
  }

  /**
   * Delete a query by ID
   * @param id Query ID
   * @returns Observable<void>
   */
  deleteQuery(id: string): Observable<void> {
    return this.http.delete(id);
  }
}
