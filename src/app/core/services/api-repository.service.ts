import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Api } from '../models/api.interface';
import { ApiRepositoryHttpService } from '../http/api-repository-http.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRepositoryService {
  constructor(private http: ApiRepositoryHttpService) {}

  /**
   * Get all available APIs
   */
  getApis(): Observable<Api[]> {
    return this.http.getAvailableApis().pipe(
      catchError((error) => {
        console.error('Error fetching APIs:', error);
        return of([]);
      })
    );
  }

  /**
   * Get a specific API by its ID
   */
  getApiById(id: string): Observable<Api | undefined> {
    return this.http.getApiById(id).pipe(
      catchError((error) => {
        console.error(`Error fetching API with id ${id}:`, error);
        return of(undefined);
      })
    );
  }
}
