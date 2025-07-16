// src/app/app.ts

import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MovieListComponent } from './components/movie-list/movie-list';
import { appConfig } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MovieListComponent],
  template: `<app-movie-list></app-movie-list>`,
})
export class AppComponent {}

// Dışa export edilen `App`, bootstrap işlemini başlatır
export const App = () => bootstrapApplication(AppComponent, appConfig);
