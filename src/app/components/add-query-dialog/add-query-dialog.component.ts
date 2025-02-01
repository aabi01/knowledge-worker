import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { Api } from '../../core/models/api.interface';

@Component({
  selector: 'app-add-query-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-query-dialog.component.html',
  styleUrls: ['./add-query-dialog.component.scss'],
})
export class AddQueryDialogComponent {
  private dialogRef = inject(DialogRef);
  private fb = inject(FormBuilder);

  queryForm: FormGroup;
  selectedParameters: { name: string; value: string }[] = [];
  selectedAttributes: string[] = [];
  selectedApi: Api | null = null;

  // Mock APIs for demonstration
  apis: Api[] = [
    {
      id: 'books-api',
      name: 'Books API',
      description: 'Query books by various parameters',
      parameters: [
        {
          name: 'author',
          type: 'string',
          description: 'Author name',
          required: true,
        },
        {
          name: 'genre',
          type: 'string',
          description: 'Book genre',
          required: true,
        },
      ],
      availableAttributes: ['title', 'author', 'price', 'availability'],
    },
  ];

  intervals = [
    { value: 300000, label: '5 minutes' },
    { value: 600000, label: '10 minutes' },
    { value: 900000, label: '15 minutes' },
    { value: 1800000, label: '30 minutes' },
    { value: 3600000, label: '1 hour' },
  ];

  constructor() {
    this.queryForm = this.fb.group({
      queryName: [''],
      selectedInterval: [300000],
      selectedApi: [null],
    });

    this.queryForm.get('selectedApi')?.valueChanges.subscribe((api) => {
      if (api) {
        this.onApiSelect(api);
      }
    });
  }

  onApiSelect(api: Api): void {
    this.selectedApi = api;
    this.selectedParameters = [];
    this.selectedAttributes = [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.queryForm.valid) {
      const formValue = this.queryForm.value;
      const query: Query = {
        id: Math.random().toString(36).substr(2, 9),
        name: formValue.queryName,
        interval: formValue.selectedInterval,
        apiId: formValue.selectedApi?.id,
        parameters: this.selectedParameters,
        selectedAttributes: this.selectedAttributes,
        isActive: true,
      };
      this.dialogRef.close(query);
    }
  }
}
