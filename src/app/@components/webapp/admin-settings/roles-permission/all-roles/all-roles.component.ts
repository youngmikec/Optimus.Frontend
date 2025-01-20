import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface RolesData {
  role: string;
  accessLevel: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  statusDesc: string;
  // actions: string;
}

const ELEMENT_DATA: RolesData[] = [
  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Inactive',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Inactive',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Inactive',
  },

  {
    role: 'Admin',
    accessLevel: 'Power User',
    createdBy: 'ogunleye grace',
    createdDate: '21/02/2012',
    lastModified: '12/12/12',
    statusDesc: 'Active',
  },
];
@Component({
  selector: 'app-all-roles',
  templateUrl: './all-roles.component.html',
  styleUrls: ['./all-roles.component.scss'],
})
export class AllRolesComponent {
  displayedColumns: string[] = [
    'select',
    'role',
    'accessLevel',
    'createdBy',
    'createdDate',
    'lastModified',
    'statusDesc',
    'actions',
  ];

  dataSource = new MatTableDataSource<RolesData>(ELEMENT_DATA);
  selection = new SelectionModel<RolesData>(true, []);

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
