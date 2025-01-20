import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as RolesActions from 'src/app/@core/stores/roles/roles.actions';
import * as RolesSelector from 'src/app/@core/stores/roles/roles.selectors';
import { select, Store } from '@ngrx/store';
// import { DefaultPagination } from 'src/app/@core/enums/index.enum';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Subscription, Observable } from 'rxjs';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-permission',
  templateUrl: './roles-permission.component.html',
  styleUrls: ['./roles-permission.component.scss'],
})
export class RolesPermissionComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    // 'select',
    'role',
    'accessLevel',
    'createdBy',
    'createdDate',
    'lastModified',
    'lastModifiedDate',
    'statusDesc',
    'actions',
  ];

  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  isLoading!: Observable<boolean>;
  getAllRolesSub!: Subscription;
  readonly editRoute: string = 'edit';
  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  getAllRoleSub!: Subscription;
  allRole!: any[];
  recordToDelete!: any;

  canCreateRole = false;
  canEditRole = false;
  canChangeRoleStatus = false;
  getRoleStatusSub!: Subscription;
  permissions: boolean[] = [];
  searchInputParam!: any | null;

  constructor(
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit() {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions = this.permissionService.getPermissionStatuses('Role');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });

    this.manageAllRoles();

    this.store
      .pipe(select(authSelectors.getUserPermissions))
      .subscribe((permissions: any) => {
        if (permissions) {
          this.canCreateRole = permissions.includes('Create Role');
          this.canEditRole = permissions.includes('Edit Role');
          this.canChangeRoleStatus = permissions.includes(
            'Activate/ Deactivate Role'
          );
        }
      });
  }

  getAllRoles(
    skip: number = DefaultPagination.skip,
    take: number = DefaultPagination.take
  ) {
    this.store.dispatch(
      RolesActions.GetAllRole({
        payload: { skip, take, searchValue: '', filter: [] },
      })
    );
  }

  manageAllRoles() {
    this.getAllRoles();

    this.getAllRoleSub = this.store
      .pipe(select(RolesSelector.getAllRoles))
      .subscribe((resData: any) => {
        if (resData) {
          // console.log(resData);

          const modifiedRoles: any[] = [];

          resData?.roleList?.forEach((role: any) => {
            const modifiedRole = {
              ...role,
              createdDate: new Date(role.createdDate).getTime(),
              lastModifiedDate: new Date(role.lastModifiedDate).getTime(),
            };

            modifiedRoles.push(modifiedRole);
          });

          const sortedRoles = modifiedRoles.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedRoles);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.count!;
          });
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource!.data);
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;

    this.store.dispatch(
      RolesActions.GetAllRole({
        payload: {
          skip: this.globalSkip,
          take: this.globalTake,
          searchValue: '',
          filter: [],
        },
      })
    );
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

  onInputSearch() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
      this.search(this.searchInputParam);
    }
  }

  search(input: string) {
    this.dataSource!.filter = input?.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  onChangeRoleStatus(id: number, status: string) {
    this.store.dispatch(RolesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      RolesActions.ActivateDeactivateRoles({
        payload: {
          id: id,
          skip: this.globalSkip,
          take: this.globalTake,
          action: status === 'Active' ? 'Deactivate' : 'Activate',
        },
      })
    );

    this.getRoleStatusSub = this.store
      .pipe(select(RolesSelector.getRoleStatus))
      .subscribe((resData: any) => {});
  }

  deleteRecord() {
    this.store.dispatch(
      RolesActions.DeleteRole({
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
        entityName: 'Role',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllRoleSub) {
      this.getAllRoleSub;
    }
  }
}
