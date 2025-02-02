import { Query } from '../../models/query.interface';

export const MOCK_QUERIES: Query[] = [
  {
    id: '1',
    name: 'Books from Yuval',
    apiId: 'books-api',
    interval: 3600000, // 1 hour
    parameters: [{ name: 'author', value: 'Yuval' }],
    selectedAttributes: ['title', 'author', 'genre', 'price'],
    isActive: true,
    lastExecuted: new Date('2025-02-02T22:30:00Z'),
  },
  {
    id: '2',
    name: 'History books',
    apiId: 'books-api',
    interval: 86400000, // 24 hours
    parameters: [{ name: 'genre', value: 'History' }],
    selectedAttributes: ['title', 'author', 'genre', 'price', 'publishDate'],
    isActive: true,
    lastExecuted: new Date('2025-02-02T20:00:00Z'),
  },
];
