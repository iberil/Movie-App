import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  template: `
    <h2>{{ data.title }}</h2>
    <img [src]="data.image" alt="{{ data.title }}" />
    <p>Rating: {{ data.rating }}</p>
    <p>{{ data.description }}</p>
    <button mat-button mat-dialog-close>Close</button>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule], // Mat modüller burada açıkça belirtilmeli
})
export class MovieDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
