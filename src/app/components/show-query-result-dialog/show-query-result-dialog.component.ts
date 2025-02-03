import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { QueryResult } from '../../core/models/query-result.interface';

@Component({
  selector: 'app-show-query-result-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-query-result-dialog.component.html',
  styleUrls: ['./show-query-result-dialog.component.scss'],
})
export class ShowQueryResultDialogComponent {
  readonly dialogRef = inject(DialogRef);
  readonly data: { query: Query; result: QueryResult } = inject(DIALOG_DATA);

  onClose(): void {
    this.dialogRef.close();
  }
}
