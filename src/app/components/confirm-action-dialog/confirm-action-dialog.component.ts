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
  template: `
    <div class="confirm-dialog">
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div class="actions">
        <button class="cancel-button" (click)="onCancel()">
          {{ data.cancelLabel || 'Cancel' }}
        </button>
        <button class="confirm-button" (click)="onConfirm()">
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 1.5rem;
      min-width: 300px;
    }

    h2 {
      margin: 0 0 1rem;
      color: #333;
    }

    p {
      margin: 0 0 1.5rem;
      color: #666;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #333;

      &:hover {
        background-color: #e8e8e8;
      }
    }

    .confirm-button {
      background-color: #f44336;
      color: white;

      &:hover {
        background-color: #da190b;
      }
    }
  `]
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
