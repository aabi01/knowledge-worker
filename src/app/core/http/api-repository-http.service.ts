import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Api } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiRepositoryHttpService {
  private readonly mockApis: Api[] = [
    {
      id: 'books-api',
      name: 'Books API',
      description: 'Query books by various parameters',
      parameters: [
        {
          name: 'author',
          type: 'string',
          description: 'Author name',
          required: true,
        },
        {
          name: 'genre',
          type: 'string',
          description: 'Book genre',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
          description: 'Publication year',
          required: false,
        },
      ],
      availableAttributes: [
        'title',
        'author',
        'genre',
        'price',
        'availability',
        'rating',
        'publishDate',
      ],
    },
    {
      id: 'movies-api',
      name: 'Movies API',
      description: 'Query movies and their details',
      parameters: [
        {
          name: 'title',
          type: 'string',
          description: 'Movie title',
          required: false,
        },
        {
          name: 'director',
          type: 'string',
          description: 'Movie director',
          required: false,
        },
        {
          name: 'genre',
          type: 'string',
          description: 'Movie genre',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
          description: 'Release year',
          required: false,
        },
      ],
      availableAttributes: [
        'title',
        'director',
        'genre',
        'releaseDate',
        'rating',
        'duration',
      ],
    },
  ];

  /**
   * Get all available APIs in the repository
   * @returns Observable<Api[]> List of available APIs
   */
  getAvailableApis(): Observable<Api[]> {
    // Simulate network delay of 500ms
    return of(this.mockApis).pipe(delay(500));
  }

  /**
   * Get a specific API by its ID
   * @param id The ID of the API to retrieve
   * @returns Observable<Api | undefined> The requested API or undefined if not found
   */
  getApiById(id: string): Observable<Api | undefined> {
    const api = this.mockApis.find((api) => api.id === id);
    // Simulate network delay of 300ms
    return of(api).pipe(delay(300));
  }
}
