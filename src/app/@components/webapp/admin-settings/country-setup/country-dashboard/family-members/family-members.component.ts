import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as FamilyMembersActions from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMembersSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import { CreateFamilyMemberComponent } from './create-family-member/create-family-member.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { IFamilyRelation } from 'src/app/@core/models/document-collection.model';
import { DeleteDialogComponent } from 'src/app/@core/shared/delete-dialog/delete-dialog.component';

export interface FamilyMembersData {
  members: string;
  country: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss'],
})
export class FamilyMembersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'country',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<FamilyMembersData[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  getAllFamilyMemberSub!: Subscription;
  readonly editRoute: string = 'edit';
  permissions: boolean[] = [];
  searchInputParam!: any | null;
  deleteRecord!: IFamilyRelation;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  // allCurrencyList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Family Member');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllFamilyMembers();
  }

  getAllFamilyMembersByCountryId() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      FamilyMembersActions.GetAllFamilyMembersByCountryId({
        payload: { id: countryId },
      })
    );
  }

  manageAllFamilyMembers() {
    this.getAllFamilyMembersByCountryId();

    this.getAllFamilyMemberSub = this.store
      .pipe(select(FamilyMembersSelector.getAllFamilyMembersByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedFamilyMemberList: any[] = [];

          resData?.forEach((country: any) => {
            const modifiedFamily = {
              ...country,
              createdDate: new Date(country.createdDate).getTime(),
              lastModifiedDate: new Date(country.lastModifiedDate).getTime(),
            };

            modifiedFamilyMemberList.push(modifiedFamily);
          });

          const sortedRoles = modifiedFamilyMemberList.slice().sort((a, b) => {
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
    // const skip = pageIndex * pageSize;
    // const take = pageIndex > 0 ? (pageIndex + 1) * pageSize : pageSize;
    // this.store.dispatch(
    //   CurrencyActions.GetAllRole({
    //     payload: { skip, take, searchValue: '', filter: [] },
    //   })
    // );
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

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const name = data.name.toLowerCase();
        return name.includes(filter);
      };
    }
  }

  onChangeRoleStatus(event: any, record: any) {
    this.store.dispatch(FamilyMembersActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        FamilyMembersActions.ActivateFamilyMembers({
          payload: {
            id: record.id,
            countryId: record.countryId,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        FamilyMembersActions.DeactivateFamilyMembers({
          payload: {
            id: record.id,
            countryId: record.countryId,
          },
        })
      );
    }
  }

  createEditFamilyMembers(type: string, editData: any) {
    this.dialog.open(CreateFamilyMemberComponent, {
      data: {
        type,
        editData,
        countryId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
      },
    });
  }

  deleteFamilyMember(record: IFamilyRelation | null): void {
    if (record) {
      this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

      this.store.dispatch(
        FamilyMembersActions.DeleteFamilyMember({
          payload: {
            id: record.id,
            countryId: record.countryId,
          },
        })
      );
    }
  }

  openDeleteModal(record: IFamilyRelation): void {
    if (!record) return;
    this.deleteRecord = record;

    this.dialog.open(DeleteDialogComponent, {
      data: {
        dialogTitle: 'Delete Family Relation',
        entityName: 'Family Relation',
        deleteRecord: record,
        // migrationRouteId: record.migrationRouteId,
        submitAction: (record: IFamilyRelation | null = null) => {
          this.deleteFamilyMember(record);
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllFamilyMemberSub) {
      this.getAllFamilyMemberSub.unsubscribe();
    }
  }
}
