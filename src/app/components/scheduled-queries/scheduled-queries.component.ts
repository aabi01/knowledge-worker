import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { AddQueryDialogComponent } from '../add-query-dialog/add-query-dialog.component';

@Component({
  selector: 'app-scheduled-queries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-queries.component.html',
  styleUrls: ['./scheduled-queries.component.scss'],
})
export class ScheduledQueriesComponent {
  constructor(private dialog: Dialog) {}

  queries: Query[] = [
    {
      id: '1',
      name: 'Books from Author ABC available',
      interval: 300000, // 5 minutes in milliseconds
      apiId: 'books-api',
      parameters: [],
      selectedAttributes: [],
      isActive: true,
    },
    {
      id: '2',
      name: 'Price for Books from Author XYZ',
      interval: 600000, // 10 minutes in milliseconds
      apiId: 'books-api',
      parameters: [],
      selectedAttributes: [],
      isActive: true,
    },
  ];

  formatInterval(milliseconds: number): string {
    const minutes = milliseconds / (1000 * 60);
    return `${minutes} min`;
  }

  onAddQuery(): void {
    const dialogRef = this.dialog.open<Query>(AddQueryDialogComponent);

    dialogRef.closed.subscribe((result?: Query) => {
      if (result) {
        this.queries = [...this.queries, result];
      }
    });
  }

  onRemoveQuery(query: Query): void {
    this.queries = this.queries.filter((q) => q.id !== query.id);
  }
}
