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
import { CreateEditBranchComponent } from './create-edit-branch/create-edit-branch.component';
import { CreateCompanyProfileComponent } from './create-company-profile/create-company-profile.component';
import { CreateEditBankAccountComponent } from './create-edit-bank-account/create-edit-bank-account.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'location',
    'country',
    'zipCode',
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
  getAllBranchesSub!: Subscription;
  logoPreview: any;
  getHeadOfficeSub!: Subscription;
  headOfficeInfo: any;
  allBankAccounts!: any;
  selectedBankAccounts!: any[];
  getAllBankAccountsSub!: Subscription;
  permissions1: boolean[] = [];
  permissions2: boolean[] = [];
  Auth1: boolean = true;
  Auth2: boolean = true;
  recordToDelete!: any;
  globalSkp: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  searchInputParam!: any | null;
  searchInputParam1!: any | null;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit() {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions1 =
        this.permissionService.getPermissionStatuses('Location');

      if (this.permissions1[0] !== true) {
        this.Auth1 = false;
      }
    });
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions2 =
        this.permissionService.getPermissionStatuses('Bank Account');

      if (this.permissions2[0] !== true) {
        this.Auth2 = false;
      }
    });
    this.manageAllBranches();

    this.getHeadOffice();

    this.getAllBankAccounts();
  }

  getAllBranches(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      DepartmentsActions.GetAllBranches({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllBranches() {
    this.getAllBranches();

    this.getAllBranchesSub = this.store
      .pipe(select(departmentsSelectors.getAllBranches))
      .subscribe((resData) => {
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

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const name = data.name.toLowerCase();
        return name.includes(filter);
      };
    }
  }

  onInputSearch1() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
      this.search1(this.searchInputParam1);
    }
  }

  search1(input: string) {
    this.selectedBankAccounts = this.allBankAccounts.filter(
      (item: any) =>
        item.bankName.toLowerCase().includes(input?.toLowerCase()) ||
        item.accountNumber.toLowerCase().includes(input?.toLowerCase())
    );
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

    this.getAllBranches(this.globalSkp, this.globalTake);
  }

  onCreateEditBranch(instance: 'create' | 'update', branchData?: any) {
    this.dialog.open(CreateEditBranchComponent, {
      data: {
        instance: instance,
        branch: branchData,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onCreateHeadOffice(instance: 'create' | 'update', headOfficeData?: any) {
    this.dialog.open(CreateCompanyProfileComponent, {
      data: {
        instance: instance,
        headOffice: headOfficeData,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  openCreateOrEditAccount(
    instance: 'create' | 'update',
    bankAccountData?: any
  ) {
    this.dialog.open(CreateEditBankAccountComponent, {
      data: {
        instance: instance,
        bankAccount: bankAccountData,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt2-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  getAllBankAccounts(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetAllBankAccounts({
        payload: {
          skip,
          take,
        },
      })
    );

    this.getAllBankAccountsSub = this.store
      .pipe(select(departmentsSelectors.getAllBankAccounts))
      .subscribe((resData) => {
        if (resData !== null) {
          this.allBankAccounts = resData;
        }
      });
  }

  deleteRecord(entity: string) {
    this.store.dispatch(
      entity === 'Branch'
        ? DepartmentsActions.DeleteBranch({
            payload: {
              id: this.recordToDelete ? this.recordToDelete.id : 0,
              skip: this.globalSkp,
              take: this.globalTake,
            },
          })
        : DepartmentsActions.DeleteBankAccount({
            payload: {
              id: this.recordToDelete ? this.recordToDelete.id : 0,
            },
          })
    );
  }

  openDeleteModal(record: any, entity: string): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: entity,
        action: () => {
          this.deleteRecord(entity);
        },
      },
    });
  }

  onChangeBranchStatus(id: number, status: string) {
    this.store.dispatch(
      DepartmentsActions.ActivateDeactivateBranch({
        payload: {
          id: id,
          skip: this.globalSkp,
          take: this.globalTake,
          action: status === 'Active' ? 'Deactivate' : 'Activate',
        },
      })
    );
  }

  onChangeBankStatus(id: number, status: string) {
    this.store.dispatch(
      DepartmentsActions.ActivateDeactivateBank({
        payload: {
          id: id,
          skip: this.globalSkp,
          take: this.globalTake,
          action: status === 'Active' ? 'Deactivate' : 'Activate',
        },
      })
    );
  }

  getHeadOffice() {
    this.store.dispatch(DepartmentsActions.GetHeadOffice());

    this.getHeadOfficeSub = this.store
      .pipe(select(departmentsSelectors.getHeadOffice))
      .subscribe((resData) => {
        if (resData !== null) {
          this.headOfficeInfo = resData;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.getAllBranchesSub) {
      this.getAllBranchesSub.unsubscribe();
    }

    if (this.getAllBankAccountsSub) {
      this.getAllBankAccountsSub.unsubscribe();
    }
  }
}
