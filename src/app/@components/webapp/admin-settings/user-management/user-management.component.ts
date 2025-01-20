import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as UserSelectors from 'src/app/@core/stores/users/users.selectors';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { UserInformationComponent } from './create-edit-user/user-information/user-information.component';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { ViewUserModalComponent } from './view-user-modal/view-user-modal.component';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { UserDeleteModalComponent } from './user-delete-modal/user-delete-modal.component';
// import { UserData } from './user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'username',
    'role',
    'jobTitle',
    'dateAdded',
    'createdBy',
    'modifiedDate',
    'modifiedDBy',
    'status',
    'actions',
  ];
  // userStatus = UserStatus;
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  getAllUserSub!: Subscription;
  totalRecords!: number;
  globalskip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;
  pageSize: number = 10;

  canChangeUserStatus = false;
  canAddUser = false;
  canEditUser = false;
  permissions: boolean[] = [];
  searchInputParam!: any | null;
  filterResult: any[] = [
    { name: 'name', column: 'Name', selected: false },
    { name: 'role', column: 'Role', selected: false },
    { name: 'status', column: 'Status', selected: false },
  ];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions = this.permissionService.getPermissionStatuses('User');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });

    this.manageAllUsers();

    this.store
      .pipe(select(authSelectors.getUserPermissions))
      .subscribe((permissions: any) => {
        if (permissions) {
          this.canChangeUserStatus = permissions.includes(
            'Activate/ Deactivate User'
          );
          this.canAddUser = permissions.includes('Create User');
          this.canEditUser = permissions.includes('Edit User');
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

  // onPaginationChange({ pageIndex, pageSize }: any): void {
  //   const skip = pageIndex * pageSize;
  //   const take = pageSize;
  //   this.paginationEvent.emit({ skip, take });
  // }

  getAllUsers(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      UserActions.GetAllUsers({
        payload: { skip: skip, take: take },
      })
    );
  }

  manageAllUsers() {
    this.getAllUsers();

    this.getAllUserSub = this.store
      .pipe(select(UserSelectors.getAllUsers))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedUsers: any[] = [];

          resData?.entity?.forEach((user: any) => {
            const modifiedUser = {
              ...user,
              createdDate: new Date(user.createdDate).getTime(),
              lastModifiedDate: new Date(user.lastModifiedDate).getTime(),
            };

            modifiedUsers.push(modifiedUser);
          });

          const sortedUsers = modifiedUsers.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });
          this.dataSource = new MatTableDataSource(sortedUsers);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData.count;
          });
        }
      });
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

  onClickFilterOption() {
    // const filterParams = this.filterResult
    //   .filter((el) => {
    //     if (el.selected === true) {
    //       return el.name;
    //     }
    //   })
    //   .map((el) => {
    //     return el.name;
    //   });
    // this.router.navigate([], {
    //   queryParams: {
    //     filter:
    //       filterParams.length > 0 ? JSON.stringify(filterParams) : undefined,
    //   },
    //   queryParamsHandling: 'merge',
    // });
  }

  clearFilterSelection() {
    this.filterResult = this.filterResult.map((el) => {
      return {
        ...el,
        selected: false,
      };
    });

    this.onClickFilterOption();
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalskip = pageIndex * pageSize;
    this.globalTake = pageSize;
    this.pageSize = pageSize;

    this.getAllUsers(this.globalskip, this.globalTake);
  }

  // openAddOrEditUser(instance: 'create' | 'update', userData?: any) {
  //   this.dialog.open(CreateEditUserComponent, {
  //     data: {
  //       instance: instance,
  //       user: userData,
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'user-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  onToggle(userId: string, status: number) {
    this.store.dispatch(
      UserActions.ChangeUserStatus({
        payload: {
          userId,
          status,
          skip: this.globalskip,
          take: this.globalTake,
        },
      })
    );
  }

  openUserInformation() {
    this.dialog.open(UserInformationComponent, {
      panelClass: [
        'customSideBarDialogContainer',
        'animate__animated',
        'animate__slideInRight',
      ],
      width: '375px',
      position: { right: '0' },
      disableClose: true,
    });
  }

  openViewUserDialog(userData: any) {
    this.dialog.open(ViewUserModalComponent, {
      width: '30%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        userData,
      },
    });
  }

  openDeleteModal(user: any): void {
    this.dialog.open(UserDeleteModalComponent, {
      data: {
        userId: user.userId,
        take: this.globalTake,
        skip: this.globalskip,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllUserSub) {
      this.getAllUserSub.unsubscribe();
    }
  }
}
