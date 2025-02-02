import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Api } from '../models/api.interface';
import { MOCKED_APIS } from '../mocked-data/apis.data';

@Injectable({
  providedIn: 'root',
})
export class ApiRepositoryHttpService {
  /**
   * Get all available APIs in the repository
   * @returns Observable<Api[]> List of available APIs
   */
  getAvailableApis(): Observable<Api[]> {
    // Simulate network delay of 500ms
    return of(MOCKED_APIS).pipe(delay(500));
  }

  /**
   * Get a specific API by its ID
   * @param id The ID of the API to retrieve
   * @returns Observable<Api | undefined> The requested API or undefined if not found
   */
  getApiById(id: string): Observable<Api | undefined> {
    const api = MOCKED_APIS.find((api) => api.id === id);
    // Simulate network delay of 300ms
    return of(api).pipe(delay(300));
  }
}
