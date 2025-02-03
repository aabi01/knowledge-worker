import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { MoviesHttpService } from '../http/movies-http.service';
import { Movie } from '../models/movies.interface';
import { of } from 'rxjs';
import { MOVIES_DATA } from '../http/mocked-data/movies.data';

describe(MoviesService.name, () => {
  let service: MoviesService;
  let httpService: jest.Mocked<MoviesHttpService>;

  const mockMovies: Movie[] = MOVIES_DATA;

  beforeEach(() => {
    const mockHttpService = {
      getAll: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        MoviesService,
        { provide: MoviesHttpService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(MoviesService);
    httpService = TestBed.inject(
      MoviesHttpService
    ) as jest.Mocked<MoviesHttpService>;

    // Default mock implementation
    httpService.getAll.mockReturnValue(of(mockMovies));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMovies', () => {
    it('should return all movies from HTTP service', (done) => {
      service.getAllMovies().subscribe((movies) => {
        expect(movies).toEqual(mockMovies);
        expect(httpService.getAll).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('queryMovies', () => {
    it('should return all movies when no params provided', (done) => {
      service.queryMovies({}).subscribe((movies) => {
        expect(movies).toEqual(mockMovies);
        expect(movies.length).toBe(mockMovies.length);
        done();
      });
    });

    it('should filter movies by title (case insensitive)', (done) => {
      service.queryMovies({ title: 'INCEPTION' }).subscribe((movies) => {
        expect(movies.length).toBe(1);
        expect(movies[0].title).toBe('Inception');
        done();
      });
    });

    it('should filter movies by partial title match', (done) => {
      service.queryMovies({ title: 'the' }).subscribe((movies) => {
        expect(movies.length).toBeGreaterThan(0);
        movies.forEach((movie) => {
          expect(movie.title.toLowerCase()).toContain('the');
        });
        done();
      });
    });

    it('should filter movies by director (case insensitive)', (done) => {
      service.queryMovies({ director: 'CHRISTOPHER NOLAN' }).subscribe((movies) => {
        expect(movies.length).toBe(2);
        movies.forEach((movie) => {
          expect(movie.director).toBe('Christopher Nolan');
        });
        done();
      });
    });

    it('should filter movies by partial director match', (done) => {
      service.queryMovies({ director: 'Chris' }).subscribe((movies) => {
        expect(movies.length).toBeGreaterThan(0);
        movies.forEach((movie) => {
          expect(movie.director.toLowerCase()).toContain('chris');
        });
        done();
      });
    });

    it('should filter movies by genre (case insensitive)', (done) => {
      service.queryMovies({ genre: 'DRAMA' }).subscribe((movies) => {
        expect(movies.length).toBe(2);
        movies.forEach((movie) => {
          expect(movie.genre).toBe('Drama');
        });
        done();
      });
    });

    it('should combine multiple filters', (done) => {
      service
        .queryMovies({
          director: 'Christopher Nolan',
          genre: 'Science Fiction',
        })
        .subscribe((movies) => {
          expect(movies.length).toBe(1);
          expect(movies[0].title).toBe('Inception');
          expect(movies[0].director).toBe('Christopher Nolan');
          expect(movies[0].genre).toBe('Science Fiction');
          done();
        });
    });

    it('should return empty array when no matches found', (done) => {
      service
        .queryMovies({
          title: 'Non Existent Movie',
          director: 'Unknown Director',
        })
        .subscribe((movies) => {
          expect(movies).toEqual([]);
          expect(movies.length).toBe(0);
          done();
        });
    });

    it('should handle empty string parameters', (done) => {
      service
        .queryMovies({
          title: '',
          director: '',
          genre: '',
        })
        .subscribe((movies) => {
          expect(movies).toEqual(mockMovies);
          expect(movies.length).toBe(mockMovies.length);
          done();
        });
    });
  });
});
