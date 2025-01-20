import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
// import { PermissionService } from 'src/app/@core/services/permission.service';
import { CreateEditJobTitleComponent } from './create-edit-job-title/create-edit-job-title.component';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.scss'],
})
export class JobTitleComponent implements OnInit, OnDestroy {
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
  getAllJobTitleSub!: Subscription;
  permissions: boolean[] = [];

  globalSkip!: number | undefined;
  globalTake!: number | undefined;
  pageSize = DefaultPagination.take;

  recordToDelete!: any;
  activeFilter = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState> // private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    // this.permissionService.currentUserPermissionValue.subscribe(() => {
    //   this.permissions =
    //     this.permissionService.getPermissionStatuses('Job Title');

    //   if (this.permissions[0] !== true) {
    //     this.permissionService.routeToUnauthorizedPage();
    //   }
    // });
    this.manageAllJobTitles();
  }

  getAllJobTitles(
    skip = this.globalSkip ? this.globalSkip : DefaultPagination.skip,
    take = this.globalTake ? this.globalTake : DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetJobTitle({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  getAllActiveJobTitles(
    skip = this.globalSkip ? this.globalSkip : DefaultPagination.skip,
    take = this.globalTake ? this.globalTake : DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetActiveJobTitle({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  getAllInactiveJobTitles(
    skip = this.globalSkip ? this.globalSkip : DefaultPagination.skip,
    take = this.globalTake ? this.globalTake : DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetInactiveJobTitle({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllJobTitles() {
    this.getAllJobTitles();

    this.getAllJobTitleSub = this.store
      .pipe(select(departmentsSelectors.getAllJobTitle))
      .subscribe((resData: any) => {
        const modifiedJobTitle: any[] = [];

        resData?.pageItems?.forEach((jobTitle: any) => {
          const modified = {
            ...jobTitle,
            createdDate: new Date(jobTitle.createdDate).getTime(),
            lastModifiedDate: new Date(jobTitle.lastModifiedDate).getTime(),
          };

          modifiedJobTitle.push(modified);
        });

        const sortedJobTitle = modifiedJobTitle.slice().sort((a, b) => {
          const dateA = new Date(a.createdDate).getTime();
          const dateB = new Date(b.createdDate).getTime();

          return dateB - dateA; //Descending order
        });

        this.dataSource = new MatTableDataSource(sortedJobTitle ?? []);

        setTimeout(() => {
          // this.dataSource!.paginator = this.paginator;
          this.dataSource!.sort = this.sort;

          this.totalRecords = resData?.totalCount;
        });
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
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;

    this.applyFilter();
  }

  onCreateEditJobTitle(instance: 'create' | 'update', jobTitleData?: any) {
    this.dialog.open(CreateEditJobTitleComponent, {
      data: {
        instance: instance,
        jobTitle: jobTitleData,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onChangeJobTitleStatus(id: number, status: string) {
    this.store.dispatch(
      DepartmentsActions.ActivateDeactivateJobTitle({
        payload: {
          id: id,
          skip: this.globalSkip,
          take: this.globalTake,
          action: status === 'Active' ? 'Deactivate' : 'Activate',
        },
      })
    );
  }

  deleteRecord() {
    this.store.dispatch(
      DepartmentsActions.DeleteJobTitle({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Job Title',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  applyFilter(index = this.activeFilter) {
    this.activeFilter = index;

    if (this.activeFilter === 0) {
      this.getAllJobTitles();
    } else {
      this.store.dispatch(
        DepartmentsActions.GetJobTitleByStatus({
          payload: {
            skip: this.globalSkip ? this.globalSkip : DefaultPagination.skip,
            take: this.globalTake ? this.globalTake : DefaultPagination.take,
            status: index,
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this.getAllJobTitleSub) {
      this.getAllJobTitleSub.unsubscribe();
    }
  }
}
