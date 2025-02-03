import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { AddQueryDialogComponent } from '../add-query-dialog/add-query-dialog.component';
import { QueryService } from '../../core/services/query.service';
import {
  Observable,
  Subject,
  switchMap,
  EMPTY,
  takeUntil,
  firstValueFrom,
  tap,
} from 'rxjs';
import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';
import { QuerySchedulerService } from '../../core/services/query-scheduler.service';
import { ShowQueryResultDialogComponent } from '../show-query-result-dialog/show-query-result-dialog.component';
import { QueryResultsService } from '../../core/store/query-results.service';

@Component({
  selector: 'app-scheduled-queries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-queries.component.html',
  styleUrls: ['./scheduled-queries.component.scss'],
})
export class ScheduledQueriesComponent implements OnInit, OnDestroy {
  readonly dialog = inject(Dialog);
  readonly queryService = inject(QueryService);
  readonly queryScheduler = inject(QuerySchedulerService);
  readonly queryResults = inject(QueryResultsService);

  queries$: Observable<Query[]> = this.queryService.getQueries();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Schedule all available queries on component initialization
    this.queries$.pipe(takeUntil(this.destroy$)).subscribe((queries) => {
      // Start all active queries
      queries.forEach((query) => {
        if (query.isActive) {
          this.queryScheduler.startQuery(query);
        }
      });
    });
  }

  ngOnDestroy() {
    // Stop all queries and cleanup
    this.queryScheduler.stopAllQueries();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddQuery() {
    const dialogRef = this.dialog.open<Query>(AddQueryDialogComponent);
    dialogRef.closed.subscribe((result) => {
      if (result) {
        // Start the query if it's active
        if (result.isActive) {
          this.queryScheduler.startQuery(result);
        }
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
      hasBackdrop: false, // We handle the backdrop in the component
    });

    dialogRef.closed
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            // Stop the query if it's running
            this.queryScheduler.stopQuery(query.id);
            return this.queryService.deleteQuery(query.id);
          }
          return EMPTY;
        }),
        tap(() => this.refreshQueries())
      )
      .subscribe();
  }

  async onShowResults(query: Query) {
    // Get the latest result for this query
    const result = await firstValueFrom(
      this.queryResults.getLatestResult(query.id)
    );
    if (!result) {
      // Show message if no results yet
      this.dialog.open(ShowQueryResultDialogComponent, {
        data: {
          query,
          result: {
            queryId: query.id,
            timestamp: new Date(),
            data: [],
            error:
              'No results available yet. The query may still be executing.',
          },
        },
      });
      return;
    }

    // Show results dialog
    this.dialog.open(ShowQueryResultDialogComponent, {
      data: { query, result },
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
