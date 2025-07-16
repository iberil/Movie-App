import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl =
    'https://api.themoviedb.org/3/movie/popular?api_key=<<c92a4572f8ddc4d11427d9d682f4d4e6>>&language=en-US&page=1';

  private baseUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`
    );
  }

  getMovies(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError((error) => {
        console.error('API hatası:', error);
        return throwError(() => error);
      })
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=tr-TR`
    );
  }
}
