import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Query } from '../models/query.interface';
import { QueryResult } from '../models/query-result.interface';
import { ApiRepositoryService } from './api-repository.service';
import { QueryResultsService } from '../store/query-results.service';
import { BooksService } from './books.service';
import { MoviesService } from './movies.service';
import { Movie } from '../models/movies.interface';
import { Book } from '../models/book.interface';

@Injectable({
  providedIn: 'root',
})
export class QueryExecutionService {
  constructor(
    private apiRepository: ApiRepositoryService,
    private queryResults: QueryResultsService,
    private booksService: BooksService,
    private moviesService: MoviesService
  ) {}

  /**
   * Execute a single query and store its result
   * @param query The query to execute
   * @returns Observable of the query result
   */
  executeQuery(query: Query): Observable<QueryResult> {
    return this.apiRepository.getApiById(query.apiId).pipe(
      switchMap((api) => {
        if (!api) {
          return this.handleError(query.id, 'API not found');
        }

        // Execute query against the appropriate service
        return this.executeServiceQuery(query, api.id).pipe(
          map((data) => this.processQueryResult(query, data)),
          catchError((error) => this.handleError(query.id, error.message))
        );
      }),
      catchError((error) => this.handleError(query.id, error.message))
    );
  }

  /**
   * Execute a query using the appropriate service
   */
  private executeServiceQuery(
    query: Query,
    apiId: string
  ): Observable<Array<Book | Movie>> {
    // Convert parameters to key-value object
    const params = query.parameters.reduce(
      (acc, param) => ({
        ...acc,
        [param.name]: param.value,
      }),
      {} as Record<string, string>
    );

    return this.apiRepository.getApiById(apiId).pipe(
      switchMap((api) => {
        if (!api) {
          return of([]);
        }

        switch (api.name) {
          case 'Books API':
            return this.booksService.queryBooks(params);
          case 'Movies API':
            return this.moviesService.queryMovies(params);
          default:
            return of([]);
        }
      })
    );
  }

  /**
   * Process the raw query result and format it according to selected attributes
   */
  private processQueryResult(
    query: Query,
    data: Array<Book | Movie>
  ): QueryResult {
    const result: QueryResult = {
      queryId: query.id,
      timestamp: new Date(),
      status: 'success',
      data: data.map((item: Book | Movie) => {
        if (!query.selectedAttributes.length) {
          return item;
        }
        const itemResult = query.selectedAttributes.reduce(
          (acc, attr) => ({
            ...acc,
            [attr]: attr in item ? item[attr as keyof typeof item] : undefined,
          }),
          {}
        );
        return itemResult;
      }),
    };

    // Store the result
    this.queryResults.storeResult(result);
    return result;
  }

  /**
   * Handle query execution errors
   */
  private handleError(
    queryId: string,
    errorMessage: string
  ): Observable<QueryResult> {
    const errorResult: QueryResult = {
      queryId,
      timestamp: new Date(),
      status: 'error',
      error: errorMessage,
      data: [],
    };

    // Store the error result
    this.queryResults.storeResult(errorResult);
    return of(errorResult);
  }
}
