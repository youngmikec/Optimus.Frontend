import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface tableData {
  currency: string;
  createdDate: string;
  lastModified: string;
  statusDesc: string;
  // actions: string;
}

const ELEMENT_DATA: tableData[] = [
  {
    currency: 'Euro(EUR)',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    currency: 'Euro(EUR)',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    currency: 'Euro(EUR)',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    currency: 'Euro(EUR)',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Inactive',
  },
];

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
})
export class CurrenciesComponent {
  displayedColumns: string[] = [
    'select',
    'currency',
    'createdDate',
    'lastModified',
    'statusDesc',
    'actions',
  ];

  dataSource = new MatTableDataSource<tableData>(ELEMENT_DATA);
  selection = new SelectionModel<tableData>(true, []);

  constructor() {}

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
