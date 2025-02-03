import { TestBed } from '@angular/core/testing';
import { QueryExecutionService } from './query-execution.service';
import { ApiRepositoryService } from './api-repository.service';
import { QueryResultsService } from '../store/query-results.service';
import { BooksService } from './books.service';
import { MoviesService } from './movies.service';
import { Query } from '../models/query.interface';
import { Book } from '../models/book.interface';
import { Movie } from '../models/movies.interface';
import { Api } from '../models/api.interface';
import { of, throwError } from 'rxjs';

describe(QueryExecutionService.name, () => {
  let service: QueryExecutionService;
  let apiRepository: jest.Mocked<ApiRepositoryService>;
  let queryResults: jest.Mocked<QueryResultsService>;
  let booksService: jest.Mocked<BooksService>;
  let moviesService: jest.Mocked<MoviesService>;

  const mockBook: Book = {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Test Genre',
    price: 29.99,
    availability: true,
    rating: 4.5,
    publishDate: '2025-01-01',
  };

  const mockMovie: Movie = {
    title: 'Test Movie',
    director: 'Test Director',
    genre: 'Test Genre',
    releaseDate: '2025-01-01',
    rating: 4.5,
    duration: '2h 30min',
  };

  const createMockQuery = (
    apiId: string = 'books-api',
    selectedAttributes: string[] = []
  ): Query => ({
    id: 'test-query',
    name: 'Test Query',
    apiId,
    interval: 60000,
    parameters: [{ name: 'test', value: 'value' }],
    selectedAttributes,
    isActive: true,
  });

  const createMockApi = (id: string): Api => ({
    id,
    name: `${id.split('-')[0].toUpperCase()} API`,
    description: 'Test API',
    parameters: [
      {
        name: 'test',
        description: 'Test parameter',
        type: 'string',
        required: true,
      },
    ],
    availableAttributes: ['title', 'author', 'genre'],
  });

  beforeEach(() => {
    const mockApiRepository = {
      getApiById: jest.fn(),
    };

    const mockQueryResults = {
      storeResult: jest.fn(),
    };

    const mockBooksService = {
      queryBooks: jest.fn(),
    };

    const mockMoviesService = {
      queryMovies: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        QueryExecutionService,
        { provide: ApiRepositoryService, useValue: mockApiRepository },
        { provide: QueryResultsService, useValue: mockQueryResults },
        { provide: BooksService, useValue: mockBooksService },
        { provide: MoviesService, useValue: mockMoviesService },
      ],
    });

    service = TestBed.inject(QueryExecutionService);
    apiRepository = TestBed.inject(
      ApiRepositoryService
    ) as jest.Mocked<ApiRepositoryService>;
    queryResults = TestBed.inject(
      QueryResultsService
    ) as jest.Mocked<QueryResultsService>;
    booksService = TestBed.inject(BooksService) as jest.Mocked<BooksService>;
    moviesService = TestBed.inject(MoviesService) as jest.Mocked<MoviesService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('executeQuery', () => {
    it('should execute a books query successfully', (done) => {
      const query = createMockQuery('books-api');
      const mockApi = createMockApi('books-api');
      const mockData = [mockBook];

      apiRepository.getApiById.mockReturnValue(of(mockApi));
      booksService.queryBooks.mockReturnValue(of(mockData));

      service.executeQuery(query).subscribe((result) => {
        expect(result.status).toBe('success');
        expect(result.queryId).toBe(query.id);
        expect(result.data).toEqual(mockData);
        expect(queryResults.storeResult).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should execute a movies query successfully', (done) => {
      const query = createMockQuery('movies-api');
      const mockApi = createMockApi('movies-api');
      const mockData = [mockMovie];

      apiRepository.getApiById.mockReturnValue(of(mockApi));
      moviesService.queryMovies.mockReturnValue(of(mockData));

      service.executeQuery(query).subscribe((result) => {
        expect(result.status).toBe('success');
        expect(result.queryId).toBe(query.id);
        expect(result.data).toEqual(mockData);
        expect(queryResults.storeResult).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should handle API not found error', (done) => {
      const query = createMockQuery('non-existent-api');
      apiRepository.getApiById.mockReturnValue(of(undefined));

      service.executeQuery(query).subscribe((result) => {
        expect(result.status).toBe('error');
        expect(result.error).toBe('API not found');
        expect(result.data).toEqual([]);
        expect(queryResults.storeResult).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should handle service query errors', (done) => {
      const query = createMockQuery('books-api');
      const mockApi = createMockApi('books-api');
      const errorMessage = 'Service error';

      apiRepository.getApiById.mockReturnValue(of(mockApi));
      booksService.queryBooks.mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      service.executeQuery(query).subscribe((result) => {
        expect(result.status).toBe('error');
        expect(result.error).toBe(errorMessage);
        expect(result.data).toEqual([]);
        expect(queryResults.storeResult).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should filter results by selected attributes', (done) => {
      const query = createMockQuery('books-api', ['title', 'author']);
      const mockApi = createMockApi('books-api');
      const mockData = [mockBook];

      apiRepository.getApiById.mockReturnValue(of(mockApi));
      booksService.queryBooks.mockReturnValue(of(mockData));

      service.executeQuery(query).subscribe((result) => {
        expect(result.status).toBe('success');
        expect(result.data).toEqual([
          {
            title: mockBook.title,
            author: mockBook.author,
          },
        ]);
        done();
      });
    });

    it('should convert query parameters to key-value object', (done) => {
      const query = createMockQuery('books-api');
      const mockApi = createMockApi('books-api');
      query.parameters = [
        { name: 'author', value: 'Test Author' },
        { name: 'genre', value: 'Test Genre' },
      ];

      apiRepository.getApiById.mockReturnValue(of(mockApi));
      booksService.queryBooks.mockReturnValue(of([mockBook]));

      service.executeQuery(query).subscribe(() => {
        expect(booksService.queryBooks).toHaveBeenCalledWith({
          author: 'Test Author',
          genre: 'Test Genre',
        });
        done();
      });
    });
  });
});
