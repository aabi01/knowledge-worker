import { TestBed } from '@angular/core/testing';
import { BooksService } from './books.service';
import { BooksHttpService } from '../http/books-http.service';
import { Book } from '../models/book.interface';
import { of } from 'rxjs';
import { BOOKS_DATA } from '../http/mocked-data/books.data';

describe(BooksService.name, () => {
  let service: BooksService;
  let httpService: jest.Mocked<BooksHttpService>;

  const mockBooks: Book[] = BOOKS_DATA;

  beforeEach(() => {
    const mockHttpService = {
      getAll: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BooksService,
        { provide: BooksHttpService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(BooksService);
    httpService = TestBed.inject(
      BooksHttpService
    ) as jest.Mocked<BooksHttpService>;

    // Default mock implementation
    httpService.getAll.mockReturnValue(of(mockBooks));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBooks', () => {
    it('should return all books from HTTP service', (done) => {
      service.getAllBooks().subscribe((books) => {
        expect(books).toEqual(mockBooks);
        expect(httpService.getAll).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('queryBooks', () => {
    it('should return all books when no params provided', (done) => {
      service.queryBooks({}).subscribe((books) => {
        expect(books).toEqual(mockBooks);
        expect(books.length).toBe(mockBooks.length);
        done();
      });
    });

    it('should filter books by author (case insensitive)', (done) => {
      service.queryBooks({ author: 'ANDY' }).subscribe((books) => {
        expect(books.length).toBe(1);
        expect(books[0].author).toBe('Andy Weir');
        done();
      });
    });

    it('should filter books by genre (case insensitive)', (done) => {
      service.queryBooks({ genre: 'SCIENCE FICTION' }).subscribe((books) => {
        expect(books.length).toBe(2);
        expect(books.every((book) => book.genre === 'Science Fiction')).toBe(
          true
        );
        done();
      });
    });

    it('should filter books by year', (done) => {
      service.queryBooks({ year: '2021' }).subscribe((books) => {
        expect(books.length).toBe(1);
        expect(books[0].title).toBe('Project Hail Mary');
        done();
      });
    });

    it('should combine multiple filters', (done) => {
      service
        .queryBooks({
          genre: 'Science Fiction',
          author: 'Andy',
        })
        .subscribe((books) => {
          expect(books.length).toBe(1);
          expect(books[0].title).toBe('Project Hail Mary');
          expect(books[0].author).toBe('Andy Weir');
          expect(books[0].genre).toBe('Science Fiction');
          done();
        });
    });

    it('should return empty array when no matches found', (done) => {
      service
        .queryBooks({
          author: 'Non Existent Author',
          genre: 'Science Fiction',
        })
        .subscribe((books) => {
          expect(books).toEqual([]);
          expect(books.length).toBe(0);
          done();
        });
    });

    it('should handle partial author matches', (done) => {
      service.queryBooks({ author: 'Matt' }).subscribe((books) => {
        expect(books.length).toBe(1);
        expect(books[0].author).toBe('Matt Haig');
        done();
      });
    });

    it('should handle invalid year parameter', (done) => {
      service.queryBooks({ year: 'invalid' }).subscribe((books) => {
        expect(books).toEqual([]);
        done();
      });
    });
  });
});
