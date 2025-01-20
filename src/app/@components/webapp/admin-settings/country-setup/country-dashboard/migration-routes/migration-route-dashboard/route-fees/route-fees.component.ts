import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as RouteFeesActions from 'src/app/@core/stores/routeFees/routeFees.actions';
import * as RouteFeeSelector from 'src/app/@core/stores/routeFees/routeFees.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as RouteFeeActions from 'src/app/@core/stores/routeFees/routeFees.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';

// import * as RouteFeeSelectors from 'src/app/@core/stores/routeFees/routeFees.selectors';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteDialogComponent } from 'src/app/@core/shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-route-fees',
  templateUrl: './route-fees.component.html',
  styleUrls: ['./route-fees.component.scss'],
})
export class RouteFeesComponent implements OnInit, OnDestroy {
  @Output() routeFeeEvent: EventEmitter<number> = new EventEmitter(true);
  routeFeeOutputData: any = {};
  displayedColumns: string[] = ['country', 'statusDesc', 'actions'];

  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  getAllRouteFeeSub!: Subscription;
  readonly editRoute: string = 'edit';

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  permissions: boolean[] = [];
  searchInputParam!: any | null;
  selectedCountry: any = {};
  selectedMigration!: any;
  migrationId = parseInt(this.route.snapshot.paramMap.get('routeId') || '');
  deleteRecord!: any;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Route Fees');
    });
    this.manageAllRouteFees();
  }

  getAllRouteFeesByMigrationId() {
    const migrationId = parseInt(
      this.route.snapshot.paramMap.get('routeId') || ''
    );
    this.store.dispatch(
      RouteFeesActions.GetAllRouteFeesByMigrationId({
        payload: { id: migrationId },
      })
    );
  }

  manageAllRouteFees() {
    this.getAllRouteFeesByMigrationId();

    this.getAllRouteFeeSub = this.store
      .pipe(select(RouteFeeSelector.getRouteFeeByMigrationId))
      .subscribe((resData: any) => {
        if (resData) {
          this.routeFeeOutputData.total = resData.length;

          let sortedList = [...resData];

          sortedList = sortedList.sort(
            (a: any, b: any) =>
              new Date(b.lastModifiedDate).getTime() -
              new Date(a.lastModifiedDate).getTime()
          );

          this.routeFeeOutputData.date = sortedList[0]?.lastModifiedDate;

          this.routeFeeEvent.emit(this.routeFeeOutputData);

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
            const dateA = new Date(a.serialNumber).getTime();
            const dateB = new Date(b.serialNumber).getTime();

            return dateA - dateB; //Ascending order
          });

          this.dataSource = new MatTableDataSource(sortedRoles);

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.count!;
          });
        }
      });
  }

  // drop(event: CdkDragDrop<any[]>) {
  //   if (this.dataSource) {
  //     moveItemInArray(
  //       this.dataSource.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     const newSequenceArray: any[] = [];
  //     this.dataSource.data.forEach((question: any, index: number) => {
  //       newSequenceArray.push({
  //         ...question,
  //         countryId: this.selectedMigration?.countryId,
  //         sequenceNo: index + 1,
  //       });
  //     });

  //     this.dataSource.data = newSequenceArray;
  //     this.updateFeesOnDrage(this.dataSource.data);
  //   }
  // }

  // if (this.dataSource) {
  //   moveItemInArray(
  //     this.dataSource.data,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   const serialList: any[] = [];

  //   this.dataSource.data.forEach((fee: any, index: number) => {
  //     if (index !== 0) {
  //       serialList.push({
  //         routeId: fee.id,
  //         serialNumber: index,
  //       });
  //     }
  //   });

  // }
  drop(event: CdkDragDrop<string[]>) {
    if (this.dataSource) {
      moveItemInArray(
        this.dataSource.data,
        event.previousIndex,
        event.currentIndex
      );

      const newSequenceArray: any[] = [];
      const serialList: any[] = [];
      this.dataSource.data.forEach((fee: any, index: number) => {
        newSequenceArray.push({
          ...fee,
          countryId: this.selectedMigration?.countryId,
          serialNumber: index + 1,
        });
        serialList.push({
          routeId: fee.id,
          serialNumber: index + 1,
        });
      });

      this.dataSource.data = newSequenceArray;
      this.updateQuestionsOnDrage(serialList);
    }
  }

  updateQuestionsOnDrage(listData: any[]): void {
    this.store.dispatch(
      RouteFeeActions.UpdateRouteFeesSerialNumber({
        payload: {
          routeFees: [...listData],
          migrationRouteId: parseInt(
            this.route.snapshot.paramMap.get('routeId') || ''
          ),
        },
      })
    );
    // this.store.dispatch(
    //   RouteFeeActions.EditMultipleRouteFee({
    //     payload: {
    //       migrationRouteId: parseInt(
    //         this.route.snapshot.paramMap.get('routeId') || ''
    //       ),
    //       routeFees: listData,
    //     },
    //   })
    // );
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
    this.store.dispatch(RouteFeesActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        RouteFeesActions.ActivateRouteFees({
          payload: {
            id: id,
            migrationId: this.migrationId,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        RouteFeesActions.DeactivateRouteFees({
          payload: {
            id: id,
            migrationId: this.migrationId,
          },
        })
      );
    }
  }

  deleteRouteFee(record: any): void {
    if (record) {
      this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

      this.store.dispatch(
        RouteFeeActions.DeleteRouteFee({
          payload: {
            id: record.id,
            migrationRouteId: record.migrationRouteId,
          },
        })
      );
    }
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.deleteRecord = record;

    this.dialog.open(DeleteDialogComponent, {
      data: {
        dialogTitle: 'Delete Route Fee',
        entityName: 'Route Fee',
        deleteRecord: record,
        migrationRouteId: record.migrationRouteId,
        submitAction: (record: any = null) => {
          this.deleteRouteFee(record);
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllRouteFeeSub) {
      this.getAllRouteFeeSub;
    }
  }
}
