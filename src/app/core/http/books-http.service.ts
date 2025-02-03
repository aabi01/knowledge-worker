import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BOOKS_DATA } from './mocked-data/books.data';
import { Book } from '../models/book.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksHttpService {
  /**
   * Retrieves all books from the mock data
   * @returns Observable<Book[]> An observable of the books array
   */
  getAll(): Observable<Book[]> {
    return of(BOOKS_DATA);
  }
}
