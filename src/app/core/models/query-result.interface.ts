import { Book } from './book.interface';
import { Movie } from './movies.interface';

export interface QueryResult {
  queryId: string;
  timestamp: Date;
  data: Array<Partial<Book | Movie>>;
  status: 'success' | 'error';
  error?: string;
}
