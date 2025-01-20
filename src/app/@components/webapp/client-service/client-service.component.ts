import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable, debounceTime, distinctUntilChanged, filter } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as SalesActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as salesSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as TableViewActions from 'src/app/@core/stores/table-view/table-view.actions';
import * as TableViewSelectors from 'src/app/@core/stores/table-view/table-view.selectors';
import { ISaleService } from './client-service.interface';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { TableViewComponent } from 'src/app/@core/shared/table-view/table-view.component';
import { AppTableViewData } from 'src/app/@core/mock-data/table-view-data';
import { ITableView } from 'src/app/@core/interfaces/tableView.interface';
import { CreateTableViewComponent } from 'src/app/@core/shared/table-view/create-table-view/create-table-view.component';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { FiltersComponent } from 'src/app/@core/shared/filters/filters.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-client-service',
  templateUrl: './client-service.component.html',
  styleUrls: ['./client-service.component.scss'],
})
export class ClientServiceComponent implements OnInit {
  public searchCtrl: FormControl = new FormControl('');
  public search$: Observable<string> = this.searchCtrl.valueChanges.pipe(
    distinctUntilChanged(),
    debounceTime(800)
  );

  public countries$: Observable<any> = this.store.select(
    CountriesSelector.getActiveCountries
  );
  public allCountries: any[] = [];

  dateForm: FormGroup;
  tableViews: ITableView[] = AppTableViewData.clientService.tableViews;
  activeTableView!: ITableView;
  startDateControl: FormControl;
  endDateControl: FormControl;

  dataSource!: MatTableDataSource<ISaleService[]>;
  totalRecords: number = 0;

  countryOptions: any[] = [];
  selectedCountry: any = '';
  selectedStatus: any = '';
  selectedAssignment: any = '';

  filterOptions: {
    id: number;
    name: string;
    fullName: string;
    description: string;
    options?: { label: string; value: number }[];
  }[] = [
    {
      id: 2,
      name: 'status',
      fullName: 'Status',
      description: 'Filter by Status',
      options: [
        {
          label: 'Active',
          value: 1,
        },
        {
          label: 'Inactive',
          value: 2,
        },
      ],
    },
    {
      id: 3,
      name: 'assignmentStatus',
      fullName: 'Assignment Status',
      description: 'Filter by Assignment Status',
      options: [
        {
          label: 'Assigned',
          value: 1,
        },
        {
          label: 'Unassigned',
          value: 2,
        },
      ],
    },
  ];

  constructor(
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    const today = new Date();
    this.startDateControl = new FormControl('', [
      Validators.required,
      this.maxDateValidator(today),
    ]);
    this.endDateControl = new FormControl('', [
      Validators.required,
      this.maxDateValidator(today),
    ]);

    this.dateForm = this.fb.group({
      startDate: this.startDateControl,
      endDate: this.endDateControl,
    });
  }

  ngOnInit(): void {
    this.getActiveTableView();
    this.getTableViewsByTableName();
    this.store.dispatch(CountriesActions.GetActiveCountries());
    this.setCountriesList();
    this.store.select(salesSelectors.getSaleList).subscribe((resData) => {
      if (resData) {
        this.dataSource = new MatTableDataSource(resData.pageItems);
        this.totalRecords = resData.totalCount;
      }
    });
  }

  setCountriesList() {
    this.countries$.pipe(filter((countries) => !!countries)).subscribe({
      next: (countries: any) =>
        (this.allCountries = countries.map((country: any) => ({
          name: country.name,
          id: country.id,
        }))),
    });
  }

  getActiveTableView(): void {
    this.store
      .pipe(select(TableViewSelectors.getActiveTableView))
      .subscribe((resData: any) => {
        if (resData) {
          this.activeTableView = resData;
        }
      });
  }

  getTableViewsByTableName(): void {
    this.store.dispatch(TableViewActions.IsLoading({ payload: true }));
    this.store.dispatch(
      TableViewActions.GetTableViewSetupByTableName({
        payload: {
          tableViewName: 'Client Service',
        },
      })
    );

    this.store
      .pipe(select(TableViewSelectors.getTableViewSetupsByTableName))
      .subscribe((resData: any) => {
        if (resData) {
          this.tableViews = this.prioritizeDefault(resData);
          // this.tableViews = [this.tableViews, ...resData];
        }
      });
  }

  prioritizeDefault(array: any[]) {
    // Find the object with 'name' that includes "default"
    const defaultItem = array.find((item) =>
      item.name.toLowerCase().includes('default')
    );
    // Filter out the default item from the array
    const filteredArray = array.filter(
      (item) => !item.name.toLowerCase().includes('default')
    );
    // If a default item exists, place it at the start
    return defaultItem ? [defaultItem, ...filteredArray] : array;
  }

  maxDateValidator(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && new Date(value) > maxDate) {
        return {
          maxDate: {
            value: value.toISOString().split('T')[0],
            maxDate: maxDate.toISOString().split('T')[0],
          },
        };
      }
      return null;
    };
  }

  markAsTouched() {
    this.startDateControl.markAllAsTouched();
    this.startDateControl.updateValueAndValidity();
    this.endDateControl.markAllAsTouched();
    this.endDateControl.updateValueAndValidity();
  }

  onCountryChange({ value }: any) {
    this.selectedCountry = value;

    const skip = DefaultPagination.skip;
    const take = DefaultPagination.take;

    this.store.dispatch(
      SalesActions.GetSalesList({
        payload: {
          skip: skip,
          take: take,
          countryId: value,
        },
      })
    );
  }

  onStatusChange({ value }: any) {
    this.selectedStatus = value;
  }

  onAssignmentChange({ value }: any) {
    this.selectedAssignment = value;
  }

  filterLoans() {
    const skip = DefaultPagination.skip;
    const take = DefaultPagination.take;

    this.markAsTouched();

    if (this.startDateControl.value && this.startDateControl.invalid) {
      this.startDateControl.patchValue('');
      const notification: Notification = {
        message: 'Start date cannot exceed todays date',
        title: 'Date Warning',
        state: 'warning',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
      return;
    }
    if (this.endDateControl.value && this.endDateControl.invalid) {
      this.endDateControl.patchValue('');
      const notification: Notification = {
        message: 'End date cannot exceed todays date',
        title: 'Date Warning',
        state: 'warning',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
      return;
    }

    const { startDate, endDate } = this.dateForm.value;

    this.store.dispatch(
      SalesActions.GetSalesList({
        payload: {
          skip: skip,
          take: take,
          ...(startDate
            ? { startDate: startDate.toISOString().split('T')[0] }
            : {}),
          ...(endDate ? { endDate: endDate.toISOString().split('T')[0] } : {}),
          ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
          ...(this.selectedAssignment
            ? { assignmentStatus: this.selectedAssignment }
            : {}),
          ...(this.selectedCountry ? { countryId: this.selectedCountry } : {}),
        },
      })
    );

    this.dateForm.reset();

    this.store.select(salesSelectors.getSaleList).subscribe((resData) => {
      if (resData) {
        this.dataSource = new MatTableDataSource(resData.pageItems);
        this.totalRecords = resData.totalCount;
      }
    });
  }

  filterLoansForExport() {
    const skip = 0;
    const take = 0;

    this.markAsTouched();

    if (this.startDateControl.value && this.startDateControl.invalid) {
      this.startDateControl.patchValue('');
      const notification: Notification = {
        message: 'Start date cannot exceed todays date',
        title: 'Date Warning',
        state: 'warning',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
      return;
    }
    if (this.endDateControl.value && this.endDateControl.invalid) {
      this.endDateControl.patchValue('');
      const notification: Notification = {
        message: 'End date cannot exceed todays date',
        title: 'Date Warning',
        state: 'warning',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
      return;
    }

    const { startDate, endDate } = this.dateForm.value;

    this.store.dispatch(
      SalesActions.GetSalesList({
        payload: {
          skip: skip,
          take: take,
          ...(startDate
            ? { startDate: startDate.toISOString().split('T')[0] }
            : {}),
          ...(endDate ? { endDate: endDate.toISOString().split('T')[0] } : {}),
          ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
          ...(this.selectedAssignment
            ? { assignmentStatus: this.selectedAssignment }
            : {}),
          ...(this.selectedCountry ? { countryId: this.selectedCountry } : {}),
        },
      })
    );

    this.dateForm.reset();

    this.store.select(salesSelectors.getSaleList).subscribe((resData) => {
      if (resData) {
        this.dataSource = new MatTableDataSource(resData.pageItems);
        this.totalRecords = resData.totalCount;
      }
    });
  }

  openCreateEditView(tableView: ITableView): void {
    if (!tableView) return;
    this.dialog.open(TableViewComponent, {
      width: '30%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        tableView,
      },
    });
  }
  openSaveViewModal(): void {
    this.dialog.open(CreateTableViewComponent, {
      width: '50%',
      data: {
        formMode: 'create',
        tableView: this.activeTableView,
        tableColumns: this.activeTableView.tableColumns,
      },
    });
  }

  openFilterModal(option: any): void {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '30%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: option,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // eslint-disable-next-line no-console
      console.log('result', result);
      if (!result || !result.value) {
        this.filterLoans();
      }

      if (result.name === 'status') {
        this.selectedStatus = String(result.value);
        this.filterLoans();
      }

      if (result.name === 'assignmentStatus') {
        this.selectedAssignment = String(result.value);
        this.filterLoans();
      }
    });
  }

  openDialog(dialogTemplate: any): void {
    const dialogRef = this.dialog.open(dialogTemplate, {
      width: '30%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.filterLoans();
    });
  }

  exportToPdf(): void {
    this.filterLoansForExport();

    const doc = new jsPDF({ orientation: 'landscape' });

    const columns = this.activeTableView.tableColumns.map((key) => ({
      title: key.name,
      dataKey: key.propertyName,
    }));
    const rows = this.dataSource.data.map((data) =>
      Object.keys(data).reduce((row, key: any) => {
        row[key] = data[key];
        return row;
      }, {} as { [key: string]: any })
    );

    doc.text('Table Data', 14, 10);

    autoTable(doc, {
      columns,
      body: rows,
      startY: 20,
    });

    // Save PDF
    doc.save('table_data.pdf');
  }

  exportToCsv(): void {
    this.filterLoansForExport();

    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(file, 'table_data.xlsx');
  }
}
