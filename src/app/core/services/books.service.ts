import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
