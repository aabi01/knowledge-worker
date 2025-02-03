import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MoviesHttpService } from '../http/movies-http.service';
import { Movie } from '../models/movies.interface';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private readonly http: MoviesHttpService) {}

  /**
   * Retrieves all movies
   * This method can be extended to add filtering, sorting, or other business logic
   * @returns Observable<Movie[]> An observable of the movies array
   */
  getAllMovies(): Observable<Movie[]> {
    return this.http.getAll();
  }
}
