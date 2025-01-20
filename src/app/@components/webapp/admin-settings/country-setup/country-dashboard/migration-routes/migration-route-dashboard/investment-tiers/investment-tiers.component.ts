import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// import * as RouteFeesActions from 'src/app/@core/stores/routeFees/routeFees.actions';
// import * as RouteFeeSelector from 'src/app/@core/stores/routeFees/routeFees.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRoutesSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { CreateInvestmentTierComponent } from 'src/app/@core/shared/create-investment-tier/create-investment-tier.component';
import { IInvestmentTier } from 'src/app/@core/interfaces/investmentTier.interface';
import { DeleteDialogComponent } from 'src/app/@core/shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-investment-tiers',
  templateUrl: './investment-tiers.component.html',
  styleUrls: ['./investment-tiers.component.scss'],
})
export class InvestmentTiersComponent implements OnInit, OnDestroy {
  @Output() routeFeeEvent: EventEmitter<number> = new EventEmitter(true);
  routeFeeOutputData: any = {};
  displayedColumns: string[] = ['name', 'statusDesc', 'actions'];

  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  getAllRouteFeeSub!: Subscription;
  readonly editRoute: string = 'edit';
  selectedMigration!: any;
  deleteRecord!: IInvestmentTier;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  permissions: boolean[] = [];
  searchInputParam!: any | null;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Route Fees');
    });
    this.manageAllInvestmentTiers();
  }

  getAllInvestmentTiersByMigrationId() {
    const migrationId = parseInt(
      this.route.snapshot.paramMap.get('routeId') || ''
    );
    this.store.dispatch(
      MigrationRoutesActions.GetAllInvestmentTiersByMigrationRouteId({
        payload: {
          migrationRouteId: migrationId,
        },
      })
    );
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
    // this.store.dispatch(
    //   MigrationRoutesActions.EditMultipleRouteQuestion({
    //     payload: {
    //       countryId: this.selectedCountry?.id,
    //       migrationRouteId: parseInt(
    //         this.route.snapshot.paramMap.get('routeId') || ''
    //       ),
    //       routeQuestions: listData,
    //     },
    //   })
    // );
  }

  manageAllInvestmentTiers() {
    this.getAllInvestmentTiersByMigrationId();

    this.store
      .pipe(select(MigrationRoutesSelector.getAllInvestmentTiers))
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
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
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

  onChangeRoleStatus(event: any, investmentTier: IInvestmentTier) {
    this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        MigrationRoutesActions.EditInvestmentTier({
          payload: {
            id: investmentTier.id,
            status: 1,
            name: investmentTier.name,
            serialNo: investmentTier.sequenceNo,
            migrationRouteId: investmentTier.migrationRouteId,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        MigrationRoutesActions.EditInvestmentTier({
          payload: {
            id: investmentTier.id,
            status: 2,
            name: investmentTier.name,
            serialNo: investmentTier.sequenceNo,
            migrationRouteId: investmentTier.migrationRouteId,
          },
        })
      );
    }
  }

  openInvestmentModal(mode: string, record: IInvestmentTier | null = null) {
    this.dialog.open(CreateInvestmentTierComponent, {
      data: {
        mode: mode,
        country: record?.country,
        migrationRoute: record?.migrationRoute,
        editInvestmentTier: record ? record : null,
      },
    });
  }

  deleteInvestmentTier(record: IInvestmentTier | null): void {
    if (record) {
      this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

      this.store.dispatch(
        MigrationRoutesActions.DeleteInvestmentTier({
          payload: {
            id: record.id,
            migrationRouteId: record.migrationRouteId,
          },
        })
      );
    }
  }

  openDeleteModal(record: IInvestmentTier): void {
    if (!record) return;
    this.deleteRecord = record;

    this.dialog.open(DeleteDialogComponent, {
      data: {
        dialogTitle: 'Delete Investment Tier',
        entityName: 'Investment Tier',
        deleteRecord: record,
        migrationRouteId: record.migrationRouteId,
        submitAction: (record: IInvestmentTier | null = null) => {
          this.deleteInvestmentTier(record);
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
