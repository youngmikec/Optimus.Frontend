import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ISaleService } from '../../client-service.interface';
// SalesTableInterface
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import * as SalesActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as salesSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as TableViewSelectors from 'src/app/@core/stores/table-view/table-view.selectors';
import { Store } from '@ngrx/store';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { ITableColumn } from 'src/app/@core/interfaces/tableView.interface';

@Component({
  selector: 'app-all-sales',
  templateUrl: './all-sales.component.html',
  styleUrls: ['./all-sales.component.scss'],
})
export class AllSalesComponent implements OnChanges, OnInit {
  @Input() search!: string | null;
  @Input() filteredDatasource!: MatTableDataSource<ISaleService[]>;
  @Input() recordsTotal!: number;
  @Input() startDate!: any;
  @Input() endDate!: any;
  @Input() selectedStatus!: string;
  @Input() selectedAssignment!: string;
  @Input() selectedCountry!: number;

  totalRecords!: number;
  excludedColumns: string[] = [
    'Migration Route',
    'Country Program',
    'Status',
    'Application stage',
    'Assigned/Unassigned',
    'Created Date',
  ];
  displayedColumns: string[] = [];
  tableColumns: ITableColumn[] = [];

  dataSource!: MatTableDataSource<ISaleService[]>;
  selection = new SelectionModel<ISaleService>(true, []);

  constructor(
    private _router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['search'].firstChange)
      this.searchSalesList(changes['search'].currentValue);
  }

  ngOnInit(): void {
    this.getActiveTableViews();
    this.getSalesList();

    if (this.filteredDatasource) {
      this.dataSource = new MatTableDataSource(this.filteredDatasource.data);
      this.totalRecords = this.recordsTotal;
    }
  }

  shouldDisplayColumn(columnName: string): boolean {
    return !this.excludedColumns.includes(columnName);
  }

  getActiveTableViews(): void {
    this.store
      .select(TableViewSelectors.getActiveTableView)
      .subscribe((resData) => {
        if (resData) {
          const filteredColumns = resData.tableColumns.filter(
            (item: ITableColumn) => item.isSelected
          );
          this.tableColumns = filteredColumns;
          this.displayedColumns = filteredColumns.map(
            (item) => item.propertyName
          );
        }
      });
  }

  searchSalesList(searchFilter: string) {
    if (searchFilter) {
      this.store.dispatch(
        SalesActions.SearchSalesList({
          payload: {
            filter: searchFilter,
            skip: DefaultPagination.skip,
            take: DefaultPagination.take,
          },
        })
      );

      this.store.select(salesSelectors.searchSaleList).subscribe((resData) => {
        if (resData) {
          this.dataSource = new MatTableDataSource(resData.data);
          this.totalRecords = resData.totalCount;
        }
      });
    } else {
      this.store.select(salesSelectors.getSaleList).subscribe((resData) => {
        if (resData) {
          this.dataSource = new MatTableDataSource(resData.data);
          this.totalRecords = resData.totalCount;
        }
      });
    }
  }

  getSalesList(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      SalesActions.GetSalesList({
        payload: {
          skip: skip,
          take: take,
          ...(this.startDate
            ? { startDate: this.startDate.toISOString().split('T')[0] }
            : {}),
          ...(this.endDate
            ? { endDate: this.endDate.toISOString().split('T')[0] }
            : {}),
          ...(this.selectedStatus ? { status: this.selectedStatus } : {}),
          ...(this.selectedAssignment
            ? { assignmentStatus: this.selectedAssignment }
            : {}),
          ...(this.selectedCountry ? { countryId: this.selectedCountry } : {}),
        },
      })
    );

    this.store.select(salesSelectors.getSaleList).subscribe((resData) => {
      if (resData) {
        this.dataSource = new MatTableDataSource(resData.data);
        this.totalRecords = resData.totalCount;
      }
    });
  }
  onPaginationChange({ pageIndex, pageSize }: any): void {
    const skip = pageIndex * pageSize;
    const take = pageSize;
    this.getSalesList(skip, take);
  }

  goToSaleOverview(application: any) {
    const { applicantName, applicantId, applicationId, applicationQuoteId } =
      application;

    this._router.navigate(
      ['app/sales-service', applicantName, applicantId, applicationId],
      { queryParams: { quoteId: applicationQuoteId } }
    );
  }
}
