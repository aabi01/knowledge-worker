import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Query } from '../../core/models/query.interface';

@Component({
  selector: 'app-scheduled-queries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-queries.component.html',
  styleUrls: ['./scheduled-queries.component.scss'],
})
export class ScheduledQueriesComponent {
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
    // To be implemented
    console.log('Add query clicked');
  }

  onRemoveQuery(query: Query): void {
    this.queries = this.queries.filter((q) => q.id !== query.id);
  }
}
