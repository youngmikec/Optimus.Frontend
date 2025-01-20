import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as fromApp from 'src/app/@core/stores/app.reducer';
// import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as PartnerActions from 'src/app/@core/stores/partners/partners.actions';
// import * as UserSelectors from 'src/app/@core/stores/users/users.selectors';
import * as PartnerSelectors from 'src/app/@core/stores/partners/partners.selectors';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { PartnerInformationComponent } from './create-edit-partner/partner-information/partner-information.component';
// import {  } from './create-edit-user/user-information/user-information.component';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { ViewPartnerModalComponent } from './view-partner-modal/view-partner-modal.component';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { ActivationModalComponent } from './activation-modal/activation-modal.component';
import {
  IALL_PARTNERS,
  IGET_ALL_PARTNERS_RESPONSE,
  IMULTIPLE_PARTNER_STATUS_UPDATE,
} from 'src/app/@core/models/partners.model';
// import { UserData } from './user';

@Component({
  selector: 'app-user-management',
  templateUrl: './partners-management.component.html',
  styleUrls: ['./partners-management.component.scss'],
})
export class PartnersManagementComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  displayedColumns: string[] = [
    'Selected',
    'Name',
    'Email',
    'Created Date',
    'Created By',
    'Last Modified Date',
    'Last Modified By',
    'status',
    'actions',
  ];
  // userStatus = UserStatus;
  dataSource: MatTableDataSource<IALL_PARTNERS> | null = null;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  getAllPartnerSub!: Subscription;
  totalRecords!: number;

  canChangePartnerStatus = false;
  canAddPartner = false;
  canEditPartner = false;
  permissions: boolean[] = [];
  searchInputParam!: any | null;
  filterResult: any[] = [
    { name: 'name', column: 'Name', selected: false },
    { name: 'role', column: 'Role', selected: false },
    { name: 'status', column: 'Status', selected: false },
  ];
  multipleStatusUpdateData: IMULTIPLE_PARTNER_STATUS_UPDATE = {
    partnerUserIds: [],
    userId: '',
  };

  cancelSelection$ = new BehaviorSubject<boolean>(true);

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService,
    private changeDetector: ChangeDetectorRef
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

    this.manageAllPartners();

    this.store
      .pipe(select(authSelectors.getUserPermissions))
      .subscribe((permissions: any) => {
        if (permissions) {
          this.canChangePartnerStatus = permissions.includes(
            'Activate/ Deactivate User'
          );
          this.canAddPartner = permissions.includes('Create User');
          this.canEditPartner = permissions.includes('Edit User');
        }
      });

    /** Get list of partnerIds for multiple status update **/
    this.selection.changed.subscribe((data) => {
      if (data.source.selected.length >= 1) {
        const selectedPartnersArr = data.source.selected;
        const selectPartnerIds = selectedPartnersArr.map(
          (data: IALL_PARTNERS) => data.partnerUserId
        );

        this.multipleStatusUpdateData = {
          ...this.multipleStatusUpdateData,
          partnerUserIds: selectPartnerIds,
        };
        return;
      }
      this.closeAlertFxn();
      this.multipleStatusUpdateData = {
        ...this.multipleStatusUpdateData,
        partnerUserIds: [],
      };
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    if (numSelected !== 0) {
      this.showAlertFxn();
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.closeAlertFxn(); // Close the alert for multiple activations and deactivations
      this.selection.clear();
      return;
    }
    this.showAlertFxn();
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

  cancel() {
    this.selection.clear();
    this.cancelSelection$.next(true);
  }

  showAlertFxn() {
    this.cancelSelection$.next(false);
  }

  closeAlertFxn() {
    this.cancelSelection$.next(true);
  }
  // onPaginationChange({ pageIndex, pageSize }: any): void {
  //   const skip = pageIndex * pageSize;
  //   const take = pageSize;
  //   this.paginationEvent.emit({ skip, take });
  // }

  getAllPartners(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      PartnerActions.GetAllPartners({
        payload: { skip: skip, take: take },
      })
    );
  }

  manageAllPartners() {
    this.getAllPartners();

    this.getAllPartnerSub = this.store
      .pipe(select(PartnerSelectors.getAllPartners))
      .subscribe((resData: IGET_ALL_PARTNERS_RESPONSE | null) => {
        if (resData) {
          this.cancel();
          const modifiedPartners: IALL_PARTNERS[] = [];

          resData.entity?.pageItems.forEach((partner: IALL_PARTNERS) => {
            const modifiedUser = {
              ...partner,
              createdDate: new Date(partner.branch.createdDate).getTime(),
              lastModifiedDate: new Date(
                partner.branch.lastModifiedDate
              ).getTime(),
            };

            modifiedPartners.push(modifiedUser);
          });

          const sortedUsers = modifiedPartners.slice().sort((a, b) => {
            const dateA = new Date(a.branch.createdDate).getTime();
            const dateB = new Date(b.branch.createdDate).getTime();

            return dateB - dateA; //Descending order
          });
          this.dataSource = new MatTableDataSource<IALL_PARTNERS>(sortedUsers);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;
            if (resData.entity?.totalCount) {
              this.totalRecords = resData.entity?.totalCount;
            }
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
    const skip = pageIndex * pageSize;
    const take = pageSize;

    this.getAllPartners(skip, take);
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

  onToggle(partnerUserId: string, userId: string, status: string) {
    this.store.dispatch(
      PartnerActions.ChangePartnerStatus({
        payload: {
          partnerUserId,
          userId,
          status: status === 'Active' ? 2 : 1,
        },
      })
    );
  }

  openPartnerInformation() {
    this.dialog.open(PartnerInformationComponent, {
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

  showActivationModal(actionType: string) {
    this.dialog.open(ActivationModalComponent, {
      width: '30%',
      height: '38%',
      panelClass: 'no-dialog-padding',
      position: {
        left: '35%',
        top: '10%',
      },
      data: {
        headerText: `${actionType} "${this.selection.selected.length}" Partners`,
        actionType,
        partnersForUpdate: this.multipleStatusUpdateData,
      },
    });
  }

  openViewPartnerDialog(userData: any) {
    this.dialog.open(ViewPartnerModalComponent, {
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

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.getAllPartnerSub) {
      this.getAllPartnerSub.unsubscribe();
    }
  }
}
