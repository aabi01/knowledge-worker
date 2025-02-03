import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddQueryDialogComponent } from './add-query-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { ApiRepositoryService } from '../../core/services/api-repository.service';
import { QueryService } from '../../core/services/query.service';
import { Api } from '../../core/models/api.interface';
import { Query } from '../../core/models/query.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';

describe(AddQueryDialogComponent.name, () => {
  let component: AddQueryDialogComponent;
  let fixture: ComponentFixture<AddQueryDialogComponent>;
  let dialogRef: jest.Mocked<DialogRef<Query>>;
  let apiRepository: jest.Mocked<ApiRepositoryService>;
  let queryService: jest.Mocked<QueryService>;

  const mockApi: Api = {
    id: 'test-api',
    name: 'Test API',
    description: 'Test API Description',
    parameters: [
      {
        name: 'param1',
        description: 'Test Parameter',
        type: 'string',
        required: true,
      },
      {
        name: 'param2',
        description: 'Optional Parameter',
        type: 'string',
        required: false,
        defaultValue: 'default',
      },
    ],
    availableAttributes: ['attr1', 'attr2', 'attr3'],
  };

  beforeEach(async () => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    const mockApiRepository = {
      getApis: jest.fn(),
    };

    const mockQueryService = {
      createQuery: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AddQueryDialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: ApiRepositoryService, useValue: mockApiRepository },
        { provide: QueryService, useValue: mockQueryService },
      ],
    }).compileComponents();

    dialogRef = TestBed.inject(DialogRef) as jest.Mocked<DialogRef<Query>>;
    apiRepository = TestBed.inject(
      ApiRepositoryService
    ) as jest.Mocked<ApiRepositoryService>;
    queryService = TestBed.inject(QueryService) as jest.Mocked<QueryService>;

    apiRepository.getApis.mockReturnValue(of([mockApi]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.queryForm.get('queryName')?.value).toBe('');
      expect(component.queryForm.get('selectedInterval')?.value).toBe(60000); // 1 minute
      expect(component.queryForm.get('selectedApi')?.value).toBeNull();
      expect(component.queryForm.get('selectedAttributes')?.value).toEqual([]);
      expect(component.queryForm.get('parameters')?.value).toEqual({});
    });

    it('should load APIs on initialization', () => {
      expect(apiRepository.getApis).toHaveBeenCalled();
    });
  });

  describe('API selection', () => {
    it('should update form when API is selected', fakeAsync(() => {
      // Select API
      component.queryForm.get('selectedApi')?.setValue(mockApi);
      tick();

      // Check if parameters form group was updated
      const parametersGroup = component.queryForm.get('parameters');
      expect(parametersGroup?.get('param1')).toBeTruthy();
      expect(parametersGroup?.get('param2')).toBeTruthy();
      expect(parametersGroup?.get('param2')?.value).toBe('default');

      // Check if required validators were set
      expect(parametersGroup?.get('param1')?.hasValidator(Validators.required)).toBe(
        true
      );
      expect(parametersGroup?.get('param2')?.hasValidator(Validators.required)).toBe(
        false
      );

      // Check if selected attributes were reset
      expect(component.selectedAttributes).toEqual([]);
    }));

    it('should update selected parameters when parameter values change', fakeAsync(() => {
      // Select API and set parameter values
      component.queryForm.get('selectedApi')?.setValue(mockApi);
      tick();

      const parametersGroup = component.queryForm.get('parameters');
      parametersGroup?.patchValue({
        param1: 'value1',
        param2: 'value2',
      });
      tick();

      expect(component.selectedParameters).toEqual([
        { name: 'param1', value: 'value1' },
        { name: 'param2', value: 'value2' },
      ]);
    }));
  });

  describe('form submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(queryService.createQuery).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should submit form and close dialog on success', fakeAsync(() => {
      const queryData: Omit<Query, 'id'> = {
        name: 'Test Query',
        interval: 60000,
        apiId: mockApi.id,
        parameters: [
          { name: 'param1', value: 'value1' },
          { name: 'param2', value: 'default' },
        ],
        selectedAttributes: ['attr1'],
        isActive: true,
      };

      const createdQuery: Query = {
        ...queryData,
        id: 'test-query-id',
      };

      // Set form values
      component.queryForm.patchValue({
        queryName: queryData.name,
        selectedInterval: queryData.interval,
        selectedApi: mockApi,
        selectedAttributes: queryData.selectedAttributes,
      });
      component.queryForm.get('parameters')?.patchValue({
        param1: 'value1',
      });

      queryService.createQuery.mockReturnValue(of(createdQuery));

      component.onSubmit();
      tick();

      expect(queryService.createQuery).toHaveBeenCalledWith(queryData);
      expect(dialogRef.close).toHaveBeenCalledWith(createdQuery);
    }));

    it('should handle error during query creation', fakeAsync(() => {
      const error = new Error('Test error');
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // Set form values
      component.queryForm.patchValue({
        queryName: 'Test Query',
        selectedInterval: 60000,
        selectedApi: mockApi,
        selectedAttributes: ['attr1'],
      });
      component.queryForm.get('parameters')?.patchValue({
        param1: 'value1',
      });

      queryService.createQuery.mockReturnValue(throwError(() => error));

      component.onSubmit();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating query:', error);
      expect(dialogRef.close).not.toHaveBeenCalled();

      // Clean up
      jest.restoreAllMocks();
    }));
  });

  describe('dialog actions', () => {
    it('should close dialog when cancel is clicked', () => {
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
