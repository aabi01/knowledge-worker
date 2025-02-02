import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface ConfirmActionData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-action-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.scss']
})
export class ConfirmActionDialogComponent {
  readonly dialogRef = inject(DialogRef);
  readonly data: ConfirmActionData = inject(DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
