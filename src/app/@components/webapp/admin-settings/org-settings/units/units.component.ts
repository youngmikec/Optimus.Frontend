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
import { CreateEditUnitsComponent } from './create-edit-units/create-edit-units.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'department',
    'division',
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
  getAllUnitsSub!: Subscription;
  permissions: boolean[] = [];
  searchInputParam!: any | null;
  globalSkp: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;
  recordToDelete!: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

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
      this.permissions = this.permissionService.getPermissionStatuses('Unit');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllUnits();
  }

  getAllUnits(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      DepartmentsActions.GetAllUnits({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllUnits() {
    this.getAllUnits();

    this.getAllUnitsSub = this.store
      .pipe(select(departmentsSelectors.getAllUnits))
      .subscribe((resData) => {
        if (resData) {
          const modifiedUnits: any[] = [];

          resData?.entity.forEach((unit: any) => {
            const modifiedUnit = {
              ...unit,
              createdDate: new Date(unit.createdDate).getTime(),
              lastModifiedDate: new Date(unit.lastModifiedDate).getTime(),
            };

            modifiedUnits.push(modifiedUnit);
          });

          const sortedUnits = modifiedUnits.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedUnits);

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

    this.getAllUnits(this.globalSkp, this.globalTake);
  }

  onCreateEditUnit(instance: 'create' | 'update', unitData?: any) {
    this.dialog.open(CreateEditUnitsComponent, {
      data: {
        instance: instance,
        unit: unitData,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onChangeUnitStatus(id: number, status: string) {
    this.store.dispatch(
      DepartmentsActions.ActivateDeactivateUnit({
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
      DepartmentsActions.DeleteUnit({
        payload: {
          unitId: this.recordToDelete ? this.recordToDelete.id : 0,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Unit',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllUnitsSub) {
      this.getAllUnitsSub.unsubscribe();
    }
  }
}
