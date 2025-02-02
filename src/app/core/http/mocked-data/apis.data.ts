import { Api } from '../../models/api.interface';

export const MOCKED_APIS: Api[] = [
  {
    id: 'books-api',
    name: 'Books API',
    description: 'Query books by various parameters',
    parameters: [
      {
        name: 'author',
        type: 'string',
        description: 'Author name',
        required: true,
      },
      {
        name: 'genre',
        type: 'string',
        description: 'Book genre',
        required: true,
      },
      {
        name: 'year',
        type: 'number',
        description: 'Publication year',
        required: false,
      },
    ],
    availableAttributes: [
      'title',
      'author',
      'genre',
      'price',
      'availability',
      'rating',
      'publishDate',
    ],
  },
  {
    id: 'movies-api',
    name: 'Movies API',
    description: 'Query movies and their details',
    parameters: [
      {
        name: 'title',
        type: 'string',
        description: 'Movie title',
        required: false,
      },
      {
        name: 'director',
        type: 'string',
        description: 'Movie director',
        required: false,
      },
      {
        name: 'genre',
        type: 'string',
        description: 'Movie genre',
        required: true,
      },
    ],
    availableAttributes: [
      'title',
      'director',
      'genre',
      'releaseDate',
      'rating',
      'duration',
    ],
  },
];
