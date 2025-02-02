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
import { Observable, switchMap } from 'rxjs';

const QUERY_INTERVALS = [
  { value: 300000, label: '5 minutes' },
  { value: 600000, label: '10 minutes' },
  { value: 900000, label: '15 minutes' },
  { value: 1800000, label: '30 minutes' },
  { value: 3600000, label: '1 hour' },
];
const DEFAULT_QUERY_INTERVAL = 300000;

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

  readonly queryIntervals = QUERY_INTERVALS;
  readonly apis$: Observable<Api[]> = this.apiRepository.getApis();

  readonly queryForm: FormGroup = new FormGroup({
    queryName: new FormControl('', Validators.required),
    selectedInterval: new FormControl(DEFAULT_QUERY_INTERVAL),
    selectedApi: new FormControl(null),
    selectedAttributes: new FormControl([], Validators.required),
    parameters: new FormGroup({}), // Add a nested form group for parameters
  });

  selectedParameters: { name: string; value: string }[] = [];
  selectedAttributes: string[] = [];
  selectedApi: Api | null = null;

  ngOnInit(): void {
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
    this.queryForm.patchValue({ selectedAttributes: [] });

    // Get the parameters form group
    const parametersGroup = this.queryForm.get('parameters') as FormGroup;

    // Clear existing controls
    Object.keys(parametersGroup.controls).forEach((key) => {
      parametersGroup.removeControl(key);
    });

    // Add new controls for each parameter
    api.parameters.forEach((param) => {
      const defaultValue = param.defaultValue || '';
      const validators = param.required ? [Validators.required] : [];
      parametersGroup.addControl(
        param.name,
        new FormControl(defaultValue, validators)
      );
    });

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
