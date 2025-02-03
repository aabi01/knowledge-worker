import { TestBed } from '@angular/core/testing';
import { BooksHttpService } from './books-http.service';
import { BOOKS_DATA } from './mocked-data/books.data';
import { Book } from '../models/book.interface';

describe(BooksHttpService.name, () => {
  let service: BooksHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BooksHttpService],
    });
    service = TestBed.inject(BooksHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all books', (done) => {
      service.getAll().subscribe((books) => {
        expect(books).toEqual(BOOKS_DATA);
        expect(books.length).toBe(BOOKS_DATA.length);
        done();
      });
    });

    it('should return books with correct structure', (done) => {
      service.getAll().subscribe((books) => {
        books.forEach((book: Book) => {
          expect(book).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              author: expect.any(String),
              genre: expect.any(String),
              price: expect.any(Number),
              availability: expect.any(Boolean),
              rating: expect.any(Number),
              publishDate: expect.any(String),
            })
          );

          // Validate data constraints
          expect(book.price).toBeGreaterThan(0);
          expect(book.rating).toBeGreaterThanOrEqual(0);
          expect(book.rating).toBeLessThanOrEqual(5);
          expect(Date.parse(book.publishDate)).not.toBeNaN();
        });
        done();
      });
    });

    it('should include specific known books', (done) => {
      const expectedBook = {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        genre: 'Fiction',
        price: 24.99,
        availability: true,
        rating: 4.5,
        publishDate: '2020-08-13',
      };

      service.getAll().subscribe((books) => {
        const foundBook = books.find((b) => b.title === expectedBook.title);
        expect(foundBook).toEqual(expectedBook);
        done();
      });
    });
  });
});
