import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { AddQueryDialogComponent } from '../add-query-dialog/add-query-dialog.component';
import { QueryService } from '../../core/services/query.service';
import { Observable, switchMap, EMPTY } from 'rxjs';
import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-scheduled-queries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-queries.component.html',
  styleUrls: ['./scheduled-queries.component.scss'],
})
export class ScheduledQueriesComponent {
  readonly dialog = inject(Dialog);
  readonly queryService = inject(QueryService);

  queries$: Observable<Query[]> = this.queryService.getQueries();

  onAddQuery() {
    const dialogRef = this.dialog.open(AddQueryDialogComponent);
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.refreshQueries();
      }
    });
  }

  onRemoveQuery(query: Query) {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        title: 'Delete Query',
        message: `Are you sure you want to delete the query "${query.name}"?`,
        confirmLabel: 'Delete',
        cancelLabel: 'Keep',
      },
    });

    dialogRef.closed
      .pipe(
        switchMap((confirmed) =>
          confirmed ? this.queryService.deleteQuery(query.id) : EMPTY
        )
      )
      .subscribe({
        next: () => {
          this.refreshQueries();
        },
        error: (error) => {
          console.error('Error removing query:', error);
          // TODO: Add proper error handling
        },
      });
  }

  private refreshQueries() {
    this.queries$ = this.queryService.getQueries();
  }

  formatInterval(interval: number): string {
    const minutes = interval / 60000; // Convert milliseconds to minutes
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = minutes / 60;
    if (hours === 1) {
      return '1 hour';
    }
    return `${hours} hours`;
  }

  formatParameters(parameters: Query['parameters']): string {
    return parameters.map(({ name, value }) => `${name}: ${value}`).join(', ');
  }

  formatAttributes(attributes: string[]): string {
    return attributes.join(', ');
  }
}
