import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieDetailComponent } from '../movie-detail/movie-detail';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="search-bar-wrapper">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Film Ara</mat-label>
        <input matInput placeholder="Film adı...">
      </mat-form-field>
    </div>
    <div class="movie-list-wrapper">
      <mat-grid-list cols="5" rowHeight="400px" gutterSize="24px">
        <mat-grid-tile *ngFor="let movie of movies">
          <mat-card class="movie-card" (click)="openDetail(movie)">
            <img mat-card-image [src]="getImageUrl(movie.poster_path)" [alt]="movie.title" />
            <div class="movie-info">
              <div class="movie-title">{{ movie.title }}</div>
              <div class="movie-date">{{ movie.release_date | date:'dd MMM yyyy' }}</div>
              <div class="movie-genres">{{ getGenreNames(movie.genre_ids) }}</div>
            </div>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
    <ng-template #loading>
      <p>Yükleniyor...</p>
    </ng-template>
  `,
  standalone: true,
  imports: [MatDialogModule, MovieDetailComponent, CommonModule, MatCardModule, MatGridListModule, MatFormFieldModule, MatInputModule],
  styleUrls: ['./movie-list.scss']
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  genres: any = {};

  constructor(private dialog: MatDialog, private movieService: MovieService) {}

  ngOnInit() {
    // Önce türleri çek
    this.movieService.getGenres().subscribe((response: any) => {
      for (const genre of response.genres) {
        this.genres[genre.id] = genre.name;
      }
      // Sonra filmleri çek
      this.movieService.getPopularMovies().subscribe((response: any) => {
        this.movies = response.results;
      });
    });
  }

  getImageUrl(path: string): string {
    return path
      ? 'https://image.tmdb.org/t/p/w500' + path
      : 'https://via.placeholder.com/300x450?text=No+Image';
  }

  getGenreNames(genreIds: number[]): string {
    return genreIds.map(id => this.genres[id]).filter(Boolean).join(', ');
  }

  openDetail(movie: any) {
    this.dialog.open(MovieDetailComponent, {
      data: {
        title: movie.title,
        image: this.getImageUrl(movie.poster_path),
        rating: movie.vote_average,
        description: movie.overview,
        genres: this.getGenreNames(movie.genre_ids),
        release_date: movie.release_date
      },
      width: '350px',
    });
  }
}
