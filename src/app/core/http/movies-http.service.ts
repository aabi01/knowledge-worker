import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movies.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoviesHttpService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all movies from the API
   * @returns Observable<Movie[]> An observable of the movies array
   */
  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiUrl}/movies`);
  }
}
