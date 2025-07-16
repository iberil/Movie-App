import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  template: `
    <h2>{{ data.title }}</h2>
    <img [src]="data.image" alt="{{ data.title }}">
    <p><strong>Puan:</strong> {{ data.rating }}</p>
    <p><strong>Türler:</strong> {{ data.genres }}</p>
    <p><strong>Çıkış Tarihi:</strong> {{ data.release_date | date:'dd MMM yyyy' }}</p>
    <p>{{ data.description }}</p>
    <button mat-button mat-dialog-close>Kapat</button>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  styleUrls: ['./movie-detail.scss']
})
export class MovieDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
