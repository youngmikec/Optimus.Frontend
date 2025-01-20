import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as FamilyMemberTypeSettingsActions from 'src/app/@core/stores/familyMemberTypeSettings/familyMemberTypeSettings.actions';
import * as FamilyMemberTypeSettingsSelector from 'src/app/@core/stores/familyMemberTypeSettings/familyMemberTypeSettings.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { CreateFamilyMemberTypeSettingsComponent } from './create-family-member-type-settings/create-family-member-type-settings.component';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';

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
  selector: 'app-family-member-type-setting',
  templateUrl: './family-member-type-setting.component.html',
  styleUrls: ['./family-member-type-setting.component.scss'],
})
export class FamilyMemberTypeSettingComponent implements OnInit, OnDestroy {
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

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

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
      this.permissions = this.permissionService.getPermissionStatuses(
        'Family Member Type Setting'
      );

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllFamilyMembers();
  }

  getAllFamilyMembersByCountryId() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      FamilyMemberTypeSettingsActions.GetAllFamilyMembersTypeSettingsByCountryId(
        {
          payload: { id: countryId },
        }
      )
    );
  }

  manageAllFamilyMembers() {
    this.getAllFamilyMembersByCountryId();

    this.getAllFamilyMemberSub = this.store
      .pipe(
        select(
          FamilyMemberTypeSettingsSelector.getAllFamilyMemberTypeSettingsByCountryId
        )
      )
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

  onChangeRoleStatus(event: any, id: number) {
    this.store.dispatch(
      FamilyMemberTypeSettingsActions.IsLoading({ payload: true })
    );
    if (event.checked === true) {
      this.store.dispatch(
        FamilyMemberTypeSettingsActions.ActivateFamilyMembers({
          payload: { id: id },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        FamilyMemberTypeSettingsActions.DeactivateFamilyMembers({
          payload: { id: id },
        })
      );
    }
  }

  createEditFamilyMembers(type: string, editData: any) {
    this.dialog.open(CreateFamilyMemberTypeSettingsComponent, {
      data: {
        type,
        editData,
        countryId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllFamilyMemberSub) {
      this.getAllFamilyMemberSub;
    }
  }
}
