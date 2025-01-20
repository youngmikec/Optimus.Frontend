import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface RolesData {
  currencyPair: string;
  createdDate: string;
  currentRate: string;
  daysRunning: string;
  lastModifiedOn: string;
  lastModifiedBy: string;
  statusDesc: string;
}

const ELEMENT_DATA: RolesData[] = [
  {
    currencyPair: 'Admin',
    createdDate: '21/02/2012',
    currentRate: '800 EUR',
    daysRunning: '2 days',
    lastModifiedOn: '12/12/12',
    lastModifiedBy: '12/12/12',
    statusDesc: 'Active',
  },
];

@Component({
  selector: 'app-manage-currency-conversion',
  templateUrl: './manage-currency-conversion.component.html',
  styleUrls: ['./manage-currency-conversion.component.scss'],
})
export class ManageCurrencyConversionComponent {
  displayedColumns: string[] = [
    'select',
    'currencyPair',
    'createdDate',
    'currentRate',
    'daysRunning',
    'lastModifiedOn',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];

  dataSource = new MatTableDataSource<RolesData>(ELEMENT_DATA);
  selection = new SelectionModel<RolesData>(true, []);
  totalRecords!: number;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor() {}

  onPaginationChange({ pageIndex, pageSize }: any): void {
    // const skip = pageIndex * pageSize;
    // const take = pageIndex > 0 ? pageIndex * pageSize : pageSize;
    // this.loadUsers(skip, take);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
}
