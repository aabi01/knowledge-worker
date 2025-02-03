import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from '../models/movies.interface';
import { MOVIES_DATA } from './mocked-data/movies.data';

@Injectable({
  providedIn: 'root',
})
export class MoviesHttpService {
  /**
   * Retrieves all movies from the mock data
   * @returns Observable<Movie[]> An observable of the movies array
   */
  getAll(): Observable<Movie[]> {
    return of(MOVIES_DATA);
  }
}
