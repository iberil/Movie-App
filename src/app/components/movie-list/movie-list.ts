import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieDetailComponent } from '../movie-detail/movie-detail';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="search-bar-wrapper">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Film Ara</mat-label>
        <input matInput [(ngModel)]="searchTerm" (input)="onSearchChange(searchTerm)" placeholder="Film adı..." />
      </mat-form-field>
    </div>

    <ng-container *ngIf="loading$ | async; else content">
      <p>Yükleniyor...</p>
    </ng-container>

    <ng-template #content>
      <div class="movie-list-wrapper">
        <mat-grid-list cols="5" rowHeight="400px" gutterSize="24px">
          <mat-grid-tile *ngFor="let movie of movies">
            <mat-card class="movie-card" (click)="openDetail(movie)">
              <img
                mat-card-image
                [src]="getImageUrl(movie.poster_path)"
                [alt]="movie.title"
              />
              <div class="movie-info">
                <div class="movie-title">{{ movie.title }}</div>
                <div class="movie-date">
                  {{ movie.release_date | date : 'dd MMM yyyy' }}
                </div>
                <div class="movie-genres">
                  {{ getGenreNames(movie.genre_ids) }}
                </div>
              </div>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
      </div>
      <mat-paginator
        [length]="totalPages * 20"
        [pageSize]="20"
        [pageSizeOptions]="[20]"
        (page)="onPageChange($event.pageIndex + 1)">
      </mat-paginator>
    </ng-template>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MovieDetailComponent,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    AsyncPipe,
    NgIf,
    NgFor,
  ],
  styleUrls: ['./movie-list.scss'],
})
export class MovieListComponent implements OnInit {
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  movies: any[] = [];
  genres: any = {};
  loading$: any;

  constructor(private dialog: MatDialog, private movieService: MovieService) {}

  ngOnInit() {
    this.loading$ = this.movieService.loading$;
    this.movieService.genres$.subscribe((genreMap) => {
      this.genres = genreMap;
    });
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies(this.searchTerm, this.currentPage).subscribe(res => {
      this.movies = res.results;
      this.totalPages = res.total_pages;
    });
  }

  onSearchChange(newQuery: string) {
    this.searchTerm = newQuery;
    this.currentPage = 1;
    this.loadMovies();
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadMovies();
  }

  getImageUrl(path: string): string {
    return path
      ? 'https://image.tmdb.org/t/p/w500' + path
      : 'https://via.placeholder.com/300x450?text=No+Image';
  }

  getGenreNames(genreIds: number[]): string {
    return genreIds
      .map((id) => this.genres[id])
      .filter(Boolean)
      .join(', ');
  }

  openDetail(movie: any) {
    this.dialog.open(MovieDetailComponent, {
      data: {
        title: movie.title,
        image: this.getImageUrl(movie.poster_path),
        rating: movie.vote_average,
        description: movie.overview,
        genres: this.getGenreNames(movie.genre_ids),
        release_date: movie.release_date,
      },
      width: '350px',
    });
  }
}
