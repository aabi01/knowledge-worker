import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BooksHttpService } from '../http/books-http.service';
import { Book } from '../models/book.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private readonly http: BooksHttpService) {}

  /**
   * Retrieves all books
   * This method can be extended to add filtering, sorting, or other business logic
   * @returns Observable<Book[]> An observable of the books array
   */
  getAllBooks(): Observable<Book[]> {
    return this.http.getAll();
  }

  queryBooks(params: Record<string, string>): Observable<Book[]> {
    return this.getAllBooks().pipe(
      map((books) => {
        return books.filter((book) => {
          // Author filter
          const authorMatch =
            !params['author'] ||
            book.author.toLowerCase().includes(params['author'].toLowerCase());

          // Genre filter
          const genreMatch =
            !params['genre'] ||
            book.genre.toLowerCase() === params['genre'].toLowerCase();

          // Year filter (if book has publishDate)
          const yearMatch =
            !params['year'] ||
            (book.publishDate &&
              new Date(book.publishDate).getFullYear() ===
                parseInt(params['year']));

          return authorMatch && genreMatch && yearMatch;
        });
      })
    );
  }
}
