import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';

import {
  IDiscountRequest,
  IDiscountRequestStats,
} from 'src/app/@core/models/discount-request.model';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { ViewDiscountRequestComponent } from '../view-discount-request/view-discount-request.component';
import { ApproveRejectDialogComponent } from '../approve-reject-dialog/approve-reject-dialog.component';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
import * as DiscountSelector from 'src/app/@core/stores/discount/discount.selectors';

@Component({
  selector: 'app-approved-discount-requests',
  templateUrl: './approved-discount-requests.component.html',
  styleUrls: ['./approved-discount-requests.component.scss'],
})
export class ApprovedDiscountRequestsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'requestId',
    'country',
    'migrationRoute',
    'requestedBy',
    'percentageAmount',
    'startDate',
    'endDate',
    'createdBy',
    'createdDate',
    'status',
    'actions',
  ];

  dataSource: MatTableDataSource<IDiscountRequest[]> | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  getAllUserSub!: Subscription;
  totalRecords!: number;
  getDiscountRequestSub!: Subscription;
  discountRequestSummary$!: Observable<IDiscountRequestStats | null>;
  discountRequestSummaryLoading$!: Observable<boolean | null>;

  skip!: number;
  take!: number;

  selectedMigrationRouteInvoiceItem!: any | null;
  quoteData!: any | null;

  dialogIsOpen = false;

  protected unsubscribe$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    public permissionService: PermissionService
  ) {
    this.discountRequestSummary$ = this.store.pipe(
      select(DiscountSelector.getDiscountRequestStats)
    );
    this.discountRequestSummaryLoading$ = this.store.pipe(
      select(DiscountSelector.getStatLoading)
    );
  }

  ngOnInit(): void {
    this.getDiscountRequestStats();
    this.manageDiscountRequestList();
  }

  getDiscountRequestStats() {
    this.store.dispatch(DiscountActions.StatLoading({ payload: true }));
    this.store.dispatch(DiscountActions.GetDiscountRequestStats());
  }

  getDiscountRequestList(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DiscountActions.GetAllDiscountRequest({
        payload: { skip: skip, take: take, status: 2 },
      })
    );
  }

  manageDiscountRequestList() {
    this.getDiscountRequestList();

    this.getDiscountRequestSub = this.store
      .pipe(select(DiscountSelector.getAllDiscountRequests))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedList: any[] = [];

          resData?.data?.forEach((item: any) => {
            const modifiedItem = {
              ...item,
              createdDate: new Date(item.createdDate).getTime(),
              lastModifiedDate: new Date(item.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedItem);
          });

          const sortedList = modifiedList.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedList);
          // this.dataSource = new MatTableDataSource(this.tableData);

          setTimeout(() => {
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.totalCount!;
          });
        }
      });
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    const skip = pageIndex * pageSize;
    const take = pageSize;
    this.skip = skip;
    this.take = take;

    this.getDiscountRequestList(skip, take);
  }

  viewDiscountRequest(requestData: IDiscountRequest) {
    if (!requestData) return;

    const dialogRef = this.dialog.open(ViewDiscountRequestComponent, {
      width: '40%',
      // height: '100vh',
      position: {
        top: '5%',
      },
      data: {
        requestData: requestData,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.toggleApproveRejectDialoog(data);
      }
      // trigger Approval or Rejection modal
    });
  }

  toggleApproveRejectDialoog(data: any) {
    this.dialog.open(ApproveRejectDialogComponent, {
      data: {
        type: data.action,
        discountRequest: data.discountRequest,
        approvedDiscountAmount: data.approvedDiscountAmount,
        approvedDiscountPercentage: data.approvedDiscountPercentage,
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.getDiscountRequestSub) {
      this.getDiscountRequestSub.unsubscribe();
    }
  }
}
