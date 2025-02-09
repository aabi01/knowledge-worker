import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Query } from '../models/query.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QueryHttpService {
  constructor(private http: HttpClient) {}

  /**
   * Get all available queries
   * @returns Observable of Query array
   */
  getAll(): Observable<Query[]> {
    return this.http.get<Query[]>(`${environment.apiUrl}/queries`);
  }

  /**
   * Create a new query
   * @param query Query data to create
   * @returns Observable of created Query
   */
  create(query: Query): Observable<Query> {
    return this.http.post<Query>(`${environment.apiUrl}/queries`, query);
  }

  /**
   * Delete a query
   * @param id Query ID
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/queries/${id}`);
  }
}
