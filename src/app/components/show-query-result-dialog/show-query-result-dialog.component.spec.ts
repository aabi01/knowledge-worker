import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowQueryResultDialogComponent } from './show-query-result-dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Query } from '../../core/models/query.interface';
import { QueryResult } from '../../core/models/query-result.interface';

describe(ShowQueryResultDialogComponent.name, () => {
  let component: ShowQueryResultDialogComponent;
  let fixture: ComponentFixture<ShowQueryResultDialogComponent>;
  let dialogRef: jest.Mocked<DialogRef<void>>;

  const mockQuery: Query = {
    id: 'test-query',
    name: 'Test Query',
    apiId: 'test-api',
    interval: 60000,
    parameters: [{ name: 'param1', value: 'value1' }],
    selectedAttributes: ['title', 'author'],
    isActive: true,
  };

  const mockResult: QueryResult = {
    queryId: mockQuery.id,
    timestamp: new Date(),
    data: [
      { title: 'Book 1', author: 'Author 1' },
      { title: 'Book 2', author: 'Author 2' },
    ],
    status: 'success',
  };

  const mockErrorResult: QueryResult = {
    queryId: mockQuery.id,
    timestamp: new Date(),
    data: [],
    status: 'error',
    error: 'Test error message',
  };

  beforeEach(async () => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ShowQueryResultDialogComponent],
      providers: [
        { provide: DialogRef, useValue: mockDialogRef },
        {
          provide: DIALOG_DATA,
          useValue: { query: mockQuery, result: mockResult },
        },
      ],
    }).compileComponents();

    dialogRef = TestBed.inject(DialogRef) as jest.Mocked<DialogRef<void>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQueryResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dialog content', () => {
    it('should display query name in header', () => {
      const header = fixture.nativeElement.querySelector('h2');
      expect(header.textContent).toContain(mockQuery.name);
    });

    it('should display table headers for selected attributes', () => {
      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBe(mockQuery.selectedAttributes.length);
      headers.forEach((header: HTMLElement, index: number) => {
        const headerText = header.textContent?.trim() ?? '';
        expect(headerText).toBe(mockQuery.selectedAttributes[index]);
      });
    });

    it('should display data rows correctly', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(mockResult.data.length);

      rows.forEach((row: HTMLElement, rowIndex: number) => {
        const cells = row.querySelectorAll('td');
        mockQuery.selectedAttributes.forEach((attr, colIndex) => {
          const cellText = cells[colIndex].textContent?.trim() ?? '';
          expect(cellText).toBe(mockResult.data[rowIndex][attr]);
        });
      });
    });

    it('should display no results message when data is empty', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ShowQueryResultDialogComponent],
        providers: [
          { provide: DialogRef, useValue: { close: jest.fn() } },
          {
            provide: DIALOG_DATA,
            useValue: {
              query: mockQuery,
              result: { ...mockResult, data: [] },
            },
          },
        ],
      });

      fixture = TestBed.createComponent(ShowQueryResultDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const noDataCell = fixture.nativeElement.querySelector('.no-data');
      expect(noDataCell).toBeTruthy();
      expect(noDataCell.textContent.trim()).toBe('No results found');
    });

    it('should display error message when result has error', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ShowQueryResultDialogComponent],
        providers: [
          { provide: DialogRef, useValue: { close: jest.fn() } },
          {
            provide: DIALOG_DATA,
            useValue: { query: mockQuery, result: mockErrorResult },
          },
        ],
      });

      fixture = TestBed.createComponent(ShowQueryResultDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent.trim()).toBe(mockErrorResult.error);
    });
  });

  describe('dialog actions', () => {
    it('should close dialog when close button is clicked', () => {
      const closeButton = fixture.nativeElement.querySelector('.close-button');
      closeButton.click();
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog when onClose is called', () => {
      component.onClose();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
