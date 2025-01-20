import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import * as RouteQuestionAction from 'src/app/@core/stores/routeQuestions/routeQuestions.actions';
import * as RouteQuestionSelector from 'src/app/@core/stores/routeQuestions/routeQuestions.selectors';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRouteSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';

// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteDialogComponent } from 'src/app/@core/shared/delete-dialog/delete-dialog.component';

export interface RouteQuestionData {
  countryId?: number;
  id?: number;
  question: string;
  country: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-route-questions',
  templateUrl: './route-questions.component.html',
  styleUrls: ['./route-questions.component.scss'],
})
export class RouteQuestionsComponent implements OnInit, OnDestroy {
  @Output() routeQuestionEvent: EventEmitter<number> = new EventEmitter(true);
  routeQuestionOutputData: any = {};

  displayedColumns: string[] = [
    'question',
    // 'createdBy',
    // 'createdDate',
    // 'lastModifiedDate',
    // 'lastModifiedBy',
    'statusDesc',
    'actions',
  ];

  dataSource: MatTableDataSource<RouteQuestionData[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  getAllRouteQuestionSub!: Subscription;
  readonly editRoute: string = 'edit';
  selectedCountry: any = {};
  selectedMigration!: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  permissions: boolean[] = [];
  searchInputParam!: any | null;
  migrationId = parseInt(this.route.snapshot.paramMap.get('routeId') || '');
  deleteRecord!: any;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      // this.permissions =
      //   this.permissionService.getPermissionStatuses('Route Questions');
      this.permissions =
        this.permissionService.getPermissionStatuses('Route Fees');
    });
    this.getOneMigrationRouteById();
    this.manageAllRouteQuestion();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (this.dataSource) {
      moveItemInArray(
        this.dataSource.data,
        event.previousIndex,
        event.currentIndex
      );

      const newSequenceArray: any[] = [];
      this.dataSource.data.forEach((question: any, index: number) => {
        newSequenceArray.push({
          ...question,
          countryId: this.selectedMigration?.countryId,
          sequenceNo: index + 1,
        });
      });

      this.dataSource.data = newSequenceArray;
      this.updateQuestionsOnDrage(this.dataSource.data);
    }
  }

  updateQuestionsOnDrage(listData: any[]): void {
    this.store.dispatch(
      RouteQuestionAction.EditMultipleRouteQuestion({
        payload: {
          countryId: this.selectedCountry?.id,
          migrationRouteId: parseInt(
            this.route.snapshot.paramMap.get('routeId') || ''
          ),
          routeQuestions: listData,
        },
      })
    );
  }

  getAllRouteQuestionByMigrationId() {
    const migrationId = parseInt(
      this.route.snapshot.paramMap.get('routeId') || ''
    );
    this.store.dispatch(
      RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
        payload: { id: migrationId },
      })
    );
  }

  getOneMigrationRouteById() {
    this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      MigrationRoutesActions.GetMigrationRoutesById({
        payload: {
          id: parseInt(this.route.snapshot.paramMap.get('routeId') || ''),
        },
      })
    );

    this.store
      .pipe(select(MigrationRouteSelector.getMigrationRoutesById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedMigration = res;
        }
      });
  }

  manageAllRouteQuestion() {
    this.getAllRouteQuestionByMigrationId();

    this.getAllRouteQuestionSub = this.store
      .pipe(select(RouteQuestionSelector.getAllRouteQuestionByMigrationId))
      .subscribe((resData: any) => {
        if (resData) {
          this.routeQuestionOutputData.total = resData.length;
          let sortedList = [...resData];

          sortedList = sortedList.sort(
            (a: any, b: any) =>
              new Date(b.lastModifiedDate).getTime() -
              new Date(a.lastModifiedDate).getTime()
          );

          this.routeQuestionOutputData.date = sortedList[0]?.lastModifiedDate;

          this.routeQuestionEvent.emit(this.routeQuestionOutputData);

          const modifiedList: any[] = [];

          resData?.forEach((data: any) => {
            const modifiedConutry = {
              ...data,
              createdDate: new Date(data.createdDate).getTime(),
              lastModifiedDate: new Date(data.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedConutry);
          });

          // const sortedRoles = modifiedList.slice().sort((a, b) => {
          //   const dateA = new Date(a.createdDate).getTime();
          //   const dateB = new Date(b.createdDate).getTime();

          //   // return dateB - dateA; //Descending order
          //   return dateA - dateB; //Ascending order
          // });

          // this.dataSource = new MatTableDataSource(sortedRoles);
          this.dataSource = new MatTableDataSource(modifiedList);

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
    this.store.dispatch(RouteQuestionAction.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        RouteQuestionAction.ActivateRouteQuestion({
          payload: { id: id, migrationId: this.migrationId },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        RouteQuestionAction.DeactivateRouteQuestion({
          payload: { id: id, migrationId: this.migrationId },
        })
      );
    }
  }

  deleteRouteQuestion(record: any): void {
    if (record) {
      this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

      this.store.dispatch(
        RouteQuestionAction.DeleteRouteQuestion({
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
        dialogTitle: 'Delete Route Question',
        entityName: 'Route Question',
        deleteRecord: record,
        migrationRouteId: record.migrationRouteId,
        submitAction: (record: any = null) => {
          this.deleteRouteQuestion(record);
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllRouteQuestionSub) {
      this.getAllRouteQuestionSub;
    }
  }
}
