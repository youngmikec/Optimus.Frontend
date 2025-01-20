import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';
import { Subscription } from 'rxjs';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { CreateEditComponent } from './create-edit/create-edit.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit, OnDestroy {
  department!: string[];

  displayedColumns: string[] = [
    'name',
    'createdDate',
    'createdByEmail',
    'lastModifiedDate',
    'lastModifiedByEmail',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  totalRecords!: number;
  getAllDepartmentsSub!: Subscription;
  permissions: boolean[] = [];
  recordToDelete!: any;
  globalSkp: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Department');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllDepartments();
  }

  getAllDepartments(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetAllDepartments({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllDepartments() {
    this.getAllDepartments();

    this.getAllDepartmentsSub = this.store
      .pipe(select(departmentsSelectors.getAllDepartments))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedDepartments: any[] = [];

          resData?.entity.forEach((department: any) => {
            const modifiedDepartment = {
              ...department,
              createdDate: new Date(department.createdDate).getTime(),
              lastModifiedDate: new Date(department.lastModifiedDate).getTime(),
            };

            modifiedDepartments.push(modifiedDepartment);
          });

          const sortedDepartments = modifiedDepartments.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedDepartments);

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData.count;
          });
        }
      });
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const name = data.name.toLowerCase();
        return name.includes(filter);
      };
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
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
    this.globalSkp = pageIndex * pageSize;
    this.globalTake = pageSize;

    this.getAllDepartments(this.globalSkp, this.globalTake);
  }

  // onCreateDepartment() {
  //   this.dialog.open(CreateEditComponent, {
  //     data: {
  //       instance: 'create',
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  // onEditDepartment(department: any) {
  //   this.dialog.open(CreateEditComponent, {
  //     data: {
  //       instance: 'update',
  //       departmentName: department?.name,
  //       departmentId: department?.id,
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  onCreateEditDivision(instance: 'create' | 'update', departmentData?: any) {
    this.permissions[1] === false
      ? null
      : this.dialog.open(CreateEditComponent, {
          data: {
            instance: instance,
            department: departmentData,
          },
          disableClose: true,
          autoFocus: true,
          panelClass: 'opt-dialog',
          backdropClass: 'opt-dialog-backdrop',
        });
  }

  deleteRecord() {
    this.store.dispatch(
      DepartmentsActions.DeleteDepartment({
        payload: {
          departmentId: this.recordToDelete ? this.recordToDelete.id : 0,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Department',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  onChangeDepartmentStatus(id: number, status: string) {
    this.store.dispatch(
      DepartmentsActions.ActivateDeactivateDepartment({
        payload: {
          id: id,
          skip: this.globalSkp,
          take: this.globalTake,
          action: status === 'Active' ? 'Deactivate' : 'Activate',
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllDepartmentsSub) {
      this.getAllDepartmentsSub.unsubscribe();
    }
  }
}
