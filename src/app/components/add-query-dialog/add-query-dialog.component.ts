import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { Api } from '../../core/models/api.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiRepositoryService } from '../../core/services/api-repository.service';
import { QueryService } from '../../core/services/query.service';
import { Observable } from 'rxjs';

const QUERY_INTERVALS = [
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' },
  { value: 600000, label: '10 minutes' },
  { value: 900000, label: '15 minutes' },
  { value: 1800000, label: '30 minutes' },
  { value: 3600000, label: '1 hour' },
];

const DEFAULT_QUERY_INTERVAL = QUERY_INTERVALS[0].value;

@Component({
  selector: 'app-add-query-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-query-dialog.component.html',
  styleUrls: ['./add-query-dialog.component.scss'],
})
export class AddQueryDialogComponent implements OnInit {
  private dialogRef = inject(DialogRef);
  private apiRepository = inject(ApiRepositoryService);
  private queryService = inject(QueryService);

  readonly queryIntervals = QUERY_INTERVALS;
  readonly apis$: Observable<Api[]> = this.apiRepository.getApis();

  readonly queryForm: FormGroup = new FormGroup({
    queryName: new FormControl('', Validators.required),
    selectedInterval: new FormControl(DEFAULT_QUERY_INTERVAL),
    selectedApi: new FormControl(null),
    selectedAttributes: new FormControl([], Validators.required),
    parameters: new FormGroup({}),
  });

  selectedParameters: { name: string; value: string }[] = [];
  selectedAttributes: string[] = [];
  selectedApi: Api | null = null;

  ngOnInit(): void {
    // Subscribe to selectedApi changes
    this.queryForm.get('selectedApi')?.valueChanges.subscribe((api: Api) => {
      if (api) {
        this.onApiSelect(api);
      }
    });

    // Subscribe to selectedAttributes changes
    this.queryForm
      .get('selectedAttributes')
      ?.valueChanges.subscribe((attributes: string[]) => {
        this.selectedAttributes = attributes;
      });
  }

  onApiSelect(api: Api): void {
    this.selectedApi = api;
    this.selectedAttributes = [];
    this.selectedParameters = [];

    // Reset the parameters form group
    const parametersGroup = new FormGroup({});
    api.parameters.forEach((param) => {
      const defaultValue = param.defaultValue || '';
      const validators = param.required ? [Validators.required] : [];
      parametersGroup.addControl(
        param.name,
        new FormControl(defaultValue, validators)
      );
    });

    this.queryForm.setControl('parameters', parametersGroup);
    this.queryForm.get('selectedAttributes')?.setValue([]);

    // Subscribe to parameter changes
    parametersGroup.valueChanges.subscribe((values: { [key: string]: any }) => {
      this.selectedParameters = Object.entries(values).map(([name, value]) => ({
        name,
        value: value?.toString() ?? '',
      }));
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.queryForm.valid) {
      const formValue = this.queryForm.value;
      const queryData: Omit<Query, 'id'> = {
        name: formValue.queryName,
        interval: formValue.selectedInterval,
        apiId: formValue.selectedApi?.id,
        parameters: this.selectedParameters,
        selectedAttributes: this.selectedAttributes,
        isActive: true,
      };

      this.queryService.createQuery(queryData).subscribe({
        next: (createdQuery) => {
          this.dialogRef.close(createdQuery);
        },
        error: (error) => {
          console.error('Error creating query:', error);
          // TODO: Add proper error handling
        },
      });
    }
  }
}
