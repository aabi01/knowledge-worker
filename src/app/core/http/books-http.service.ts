import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BooksHttpService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all books from the API
   * @returns Observable<Book[]> An observable of the books array
   */
  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.apiUrl}/books`);
  }
}
