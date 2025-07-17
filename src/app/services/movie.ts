import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  // State için BehaviorSubject'ler
  private moviesSubject = new BehaviorSubject<any[]>([]);
  movies$ = this.moviesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private genresSubject = new BehaviorSubject<any>({});
  genres$ = this.genresSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Bu metot BehaviorSubject'leri tetikler
  fetchPopularMovies(page: number = 1): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get<any>(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=tr-TR&page=${page}`
      )
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((error) => {
          console.error('API hatası:', error);
          this.loadingSubject.next(false);
          this.errorSubject.next('Film listesi alınamadı');
          return of({ results: [] });
        })
      )
      .subscribe((response) => {
        this.moviesSubject.next(response.results || []);
      });
  }

  // Eğer sadece observable döndürmek istenirse (direkt kullanım)
  getPopularMovies(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`
    );
  }

  getMovies(query: string = '', page: number = 1): Observable<any> {
    if (query) {
      return this.http.get(`${this.baseUrl}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query,
          page: page.toString(),
        }
      });
    } else {
      return this.http.get(`${this.baseUrl}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page: page.toString(),
        }
      });
    }
  }

  getGenres(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=tr-TR`
    );
  }

  // Hem türleri hem filmleri çeken fonksiyon
  fetchGenresAndMovies(page: number = 1): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Önce türleri çek
    this.getGenres().subscribe((genreResponse: any) => {
      const genreMap: any = {};
      for (const genre of genreResponse.genres) {
        genreMap[genre.id] = genre.name;
      }
      this.genresSubject.next(genreMap);

      // Sonra filmleri çek
      this.http
        .get<any>(
          `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=tr-TR&page=${page}`
        )
        .pipe(
          tap(() => this.loadingSubject.next(false)),
          catchError((error) => {
            console.error('API hatası:', error);
            this.loadingSubject.next(false);
            this.errorSubject.next('Film listesi alınamadı');
            return of({ results: [] });
          })
        )
        .subscribe((response) => {
          this.moviesSubject.next(response.results || []);
        });
    });
  }
}
