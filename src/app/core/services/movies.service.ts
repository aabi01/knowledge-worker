import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  queryMovies(params: Record<string, string>): Observable<Movie[]> {
    return this.getAllMovies().pipe(
      map((movies) => {
        return movies.filter((movie) => {
          // Title filter
          const titleMatch =
            !params['title'] ||
            movie.title.toLowerCase().includes(params['title'].toLowerCase());

          //Director filter
          const directorMatch =
            !params['director'] ||
            movie.director
              .toLowerCase()
              .includes(params['director'].toLowerCase());

          // genre filter
          const genreMatch =
            !params['genre'] ||
            movie.genre.toLowerCase() === params['genre'].toLowerCase();

          return titleMatch && directorMatch && genreMatch;
        });
      })
    );
  }
}
