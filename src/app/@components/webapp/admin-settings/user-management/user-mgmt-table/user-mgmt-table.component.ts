import {
  Component,
  ViewChild,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserStatus } from 'src/app/@core/enums/index.enum';
// import { Store } from '@ngrx/store';
// import * as fromApp from 'src/app/@core/stores/app.reducer';
// import * as UserActions from 'src/app/@core/stores/users/users.actions';

@Component({
  selector: 'app-user-mgmt-table',
  templateUrl: './user-mgmt-table.component.html',
  styleUrls: ['./user-mgmt-table.component.scss'],
})
export class UserMgmtTableComponent implements OnChanges {
  displayedColumns: string[] = [
    'select',
    'username',
    'email',
    'dateAdded',
    'role',
    'status',
    'actions',
  ];
  userStatus = UserStatus;
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  @Input() tableData!: any[] | null;
  @Input() currentTab!: string;
  @Input() totalRecords!: number;

  @Output() editUser = new EventEmitter<any>();
  @Output() paginationEvent = new EventEmitter<{
    skip: number;
    take: number;
  }>();

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    public dialog: MatDialog // private store: Store<fromApp.AppState>
  ) {}

  ngOnChanges(): void {
    if (this.tableData) {
      this.dataSource = new MatTableDataSource(this.tableData);

      setTimeout(() => {
        // this.dataSource!.paginator = this.paginator;
        this.dataSource!.sort = this.sort;
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource!.data);
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

  onPaginationChange({ pageIndex, pageSize }: any): void {
    const skip = pageIndex * pageSize;
    const take = pageSize;
    this.paginationEvent.emit({ skip, take });
  }

  // onEditUser(user: any) {
  //   this.editUser.emit(user);
  // }

  // onChangeUserStatus(userId: string) {
  //   this.store.dispatch(UserActions.IsLoading({ payload: true }));

  //   this.store.dispatch(UserActions.ChangeUserStatus({ payload: { userId } }));
  // }
}
