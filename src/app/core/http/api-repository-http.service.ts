import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../models/api.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiRepositoryHttpService {
  constructor(private http: HttpClient) {}

  /**
   * Get all available APIs in the repository
   * @returns Observable<Api[]> List of available APIs
   */
  getAvailableApis(): Observable<Api[]> {
    return this.http.get<Api[]>(`${environment.apiUrl}/api-repository`);
  }

  /**
   * Get a specific API by its ID
   * @param id The ID of the API to retrieve
   * @returns Observable<Api | undefined> The requested API or undefined if not found
   */
  getApiById(id: string): Observable<Api> {
    return this.http.get<Api>(`${environment.apiUrl}/api-repository/${id}`);
  }
}
