import { Book } from './book.interface';
import { Movie } from './movies.interface';

export type QueryResultItem = Partial<Book | Movie> & {
  [key: string]: any;
}

export interface QueryResult {
  queryId: string;
  timestamp: Date;
  data: Array<QueryResultItem>;
  status: 'success' | 'error';
  error?: string;
}
