import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MoviesHttpService } from './movies-http.service';
import { MOVIES_DATA } from './mocked-data/movies.data';
import { environment } from '../../../environments/environment';
import { Movie } from '../models/movies.interface';

describe(MoviesHttpService.name, () => {
  let service: MoviesHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesHttpService],
    });
    service = TestBed.inject(MoviesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all movies', (done) => {
      service.getAll().subscribe((movies) => {
        expect(movies).toEqual(MOVIES_DATA);
        expect(movies.length).toBe(MOVIES_DATA.length);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
      expect(req.request.method).toBe('GET');
      req.flush(MOVIES_DATA);
    });

    it('should return movies with correct structure', (done) => {
      service.getAll().subscribe((movies) => {
        movies.forEach((movie: Movie) => {
          expect(movie).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              director: expect.any(String),
              genre: expect.any(String),
              releaseDate: expect.any(String),
              rating: expect.any(Number),
              duration: expect.any(String),
            })
          );
        });
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
      expect(req.request.method).toBe('GET');
      req.flush(MOVIES_DATA);
    });

    it('should include specific known movies', (done) => {
      const expectedMovie = {
        title: 'Inception',
        director: 'Christopher Nolan',
        genre: 'Science Fiction',
        releaseDate: '2010-07-16',
        rating: 4.8,
        duration: '2h 28min',
      };

      service.getAll().subscribe((movies) => {
        const foundMovie = movies.find((m) => m.title === expectedMovie.title);
        expect(foundMovie).toEqual(expectedMovie);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
      expect(req.request.method).toBe('GET');
      req.flush(MOVIES_DATA);
    });

    it('should have valid release dates', (done) => {
      service.getAll().subscribe((movies) => {
        movies.forEach((movie) => {
          const releaseDate = new Date(movie.releaseDate);
          expect(releaseDate).toBeInstanceOf(Date);
          expect(releaseDate.getTime()).toBeLessThanOrEqual(Date.now());
          expect(releaseDate.getFullYear()).toBeGreaterThan(1900);
        });
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
      expect(req.request.method).toBe('GET');
      req.flush(MOVIES_DATA);
    });

    it('should have valid duration format', (done) => {
      service.getAll().subscribe((movies) => {
        movies.forEach((movie) => {
          const durationPattern = /^(\d+)h (\d+)min$/;
          const matches = movie.duration.match(durationPattern);

          expect(matches).toBeTruthy();
          if (matches) {
            const hours = parseInt(matches[1]);
            const minutes = parseInt(matches[2]);

            expect(hours).toBeGreaterThan(0);
            expect(minutes).toBeGreaterThanOrEqual(0);
            expect(minutes).toBeLessThan(60);
          }
        });
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
      expect(req.request.method).toBe('GET');
      req.flush(MOVIES_DATA);
    });

    it('should have ratings within valid range', (done) => {
      service.getAll().subscribe((movies) => {
        movies.forEach((movie) => {
          expect(movie.rating).toBeGreaterThanOrEqual(0);
          expect(movie.rating).toBeLessThanOrEqual(5);
          expect(Number.isFinite(movie.rating)).toBe(true);
        });
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
      expect(req.request.method).toBe('GET');
      req.flush(MOVIES_DATA);
    });
  });
});
