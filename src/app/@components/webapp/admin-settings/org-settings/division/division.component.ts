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
import { CreateEditDivisionComponent } from './create-edit-division/create-edit-division.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
})
export class DivisionComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'createdDate',
    'createdByEmail',
    'lastModifiedDate',
    'lastModifiedByEmail',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<any> | null = null;
  selection = new SelectionModel<any>(true, []);
  totalRecords!: number;
  getAllDivisionsSub!: Subscription;
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

  ngOnInit() {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Division');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllDivisions();
  }

  getAllDivisions(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetAllDivisions({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllDivisions() {
    this.getAllDivisions();

    this.getAllDivisionsSub = this.store
      .pipe(select(departmentsSelectors.getAllDivisions))
      .subscribe((resData) => {
        if (resData) {
          const modifiedDivisions: any[] = [];

          resData?.entity.forEach((division: any) => {
            const modifiedDivision = {
              ...division,
              createdDate: new Date(division.createdDate).getTime(),
              lastModifiedDate: new Date(division.lastModifiedDate).getTime(),
            };

            modifiedDivisions.push(modifiedDivision);
          });

          const sortedDivisions = modifiedDivisions.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedDivisions);

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
    this.getAllDivisions(this.globalSkp, this.globalTake);
  }

  // onCreateDivision() {
  //   this.dialog.open(CreateEditDivisionComponent, {
  //     data: {
  //       instance: 'create',
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  // onEditDivision(instance: string, division: any) {
  //   this.dialog.open(CreateEditDivisionComponent, {
  //     data: {
  //       instance: 'update',
  //       name: division?.name,
  //       divisionId: division?.id,
  //       departmentId: division?.departmentId,
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  onCreateEditDivision(instance: 'create' | 'update', divisionData?: any) {
    this.permissions[1] === false
      ? null
      : this.dialog.open(CreateEditDivisionComponent, {
          data: {
            instance: instance,
            division: divisionData,
          },
          disableClose: true,
          autoFocus: true,
          panelClass: 'opt-dialog',
          backdropClass: 'opt-dialog-backdrop',
        });
  }

  // onToggle(id: number) {
  //   this.store.dispatch(
  //     DepartmentsActions.ChangeDivisionStatus({
  //       payload: { divisionId: id },
  //     })
  //   );
  // }

  onChangeDivisionStatus(id: number, status: string) {
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

  deleteRecord() {
    this.store.dispatch(
      DepartmentsActions.DeleteDivision({
        payload: {
          divisionId: this.recordToDelete ? this.recordToDelete.id : 0,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Division',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllDivisionsSub) {
      this.getAllDivisionsSub.unsubscribe();
    }
  }
}
