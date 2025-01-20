import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRoutesSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMigrationRouteComponent } from './create-migration-route/create-migration-route.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

export interface MigrationData {
  countryId: number;
  id: number;
  name: string;
  country: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
  countryName?: string;
}
@Component({
  selector: 'app-migration-routes',
  templateUrl: './migration-routes.component.html',
  styleUrls: ['./migration-routes.component.scss'],
})
export class MigrationRoutesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'country',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];

  dataSource: MatTableDataSource<MigrationData[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  recordToDelete!: MigrationData;

  totalRecords = 10;
  getAllMigrationRouteSub!: Subscription;
  readonly editRoute: string = 'edit';

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  permissions: boolean[] = [];
  searchInputParam!: any | null;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Migration Routes');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllMigrationRoutes();
  }

  ngAfterViewInit() {
    this.store.dispatch(
      CountriesActions.GetAllCountry({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );
  }

  getAllMigrationRoutes() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');

    this.store.dispatch(
      MigrationRoutesActions.GetAllMigrationRoutesByCountryId({
        payload: { id: countryId },
      })
    );
  }

  manageAllMigrationRoutes() {
    this.getAllMigrationRoutes();

    this.getAllMigrationRouteSub = this.store
      .pipe(select(MigrationRoutesSelector.getAllMigrationRoutesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedList: any[] = [];

          resData?.forEach((data: any) => {
            const modifiedConutry = {
              ...data,
              createdDate: new Date(data.createdDate).getTime(),
              lastModifiedDate: new Date(data.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedConutry);
          });

          const sortedRoles = modifiedList.slice().sort((a, b) => {
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

  onChangeRoleStatus(event: any, record: MigrationData) {
    this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        MigrationRoutesActions.ActivateMigrationRoutes({
          payload: {
            id: record ? record.id : 0,
            countryId: record ? record.countryId : 0,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        MigrationRoutesActions.DeactivateMigrationRoutes({
          payload: {
            id: record ? record.id : 0,
            countryId: record ? record.countryId : 0,
          },
        })
      );
    }
  }

  openAddOrEditMigrationRoute(type: string, editData: any) {
    this.dialog.open(CreateMigrationRouteComponent, {
      data: {
        type,
        editData,
        countryId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
      },
    });
  }

  goToMigrationRouteDashboard(id: number) {
    this.router.navigate(['/app/admin-settings/country-setup/dashboard', id]);
  }

  deleteRecord() {
    this.store.dispatch(
      MigrationRoutesActions.DeleteMigrationRoutes({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
          countryId: this.recordToDelete ? this.recordToDelete.countryId : 0,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Migration Route',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllMigrationRouteSub) {
      this.getAllMigrationRouteSub.unsubscribe();
    }
  }
}
