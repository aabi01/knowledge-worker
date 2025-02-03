import { Query } from '../../models/query.interface';

export const MOCK_QUERIES: Query[] = [
  {
    id: '1',
    name: 'Books from Yuval',
    apiId: 'books-api',
    interval: 300000, // 5 minutes
    parameters: [{ name: 'author', value: 'Yuval' }],
    selectedAttributes: ['title', 'author', 'genre', 'price'],
    isActive: true,
    lastExecuted: new Date('2025-02-02T22:30:00Z'),
  },
  {
    id: '2',
    name: 'History books',
    apiId: 'books-api',
    interval: 600000, // 10 minutes
    parameters: [{ name: 'genre', value: 'History' }],
    selectedAttributes: ['title', 'author', 'genre', 'price', 'publishDate'],
    isActive: true,
    lastExecuted: new Date('2025-02-02T20:00:00Z'),
  },
];
