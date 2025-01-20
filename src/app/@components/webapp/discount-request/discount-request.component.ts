import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
import * as DiscountSelector from 'src/app/@core/stores/discount/discount.selectors';
import { IDiscountRequestStats } from 'src/app/@core/models/discount-request.model';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { AllDiscountRequestsComponent } from './all-discount-requests/all-discount-requests.component';
import { ApprovedDiscountRequestsComponent } from './approved-discount-requests/approved-discount-requests.component';
import { PendingDiscountRequestsComponent } from './pending-discount-requests/pending-discount-requests.component';
import { DeclinedDiscountRequestsComponent } from './declined-discount-requests/declined-discount-requests.component';

@Component({
  selector: 'app-discount-request',
  templateUrl: './discount-request.component.html',
  styleUrls: ['./discount-request.component.scss'],
})
export class DiscountRequestComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  dataSource: MatTableDataSource<any[]> | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  @ViewChild('allDiscountRequests') allDiscountRequests: any =
    AllDiscountRequestsComponent;
  @ViewChild('approvedDiscountRequests') approvedDiscountRequests: any =
    ApprovedDiscountRequestsComponent;
  @ViewChild('pendingDiscountRequests') pendingDiscountRequests: any =
    PendingDiscountRequestsComponent;
  @ViewChild('declinedDiscountRequests') declinedDiscountRequests: any =
    DeclinedDiscountRequestsComponent;

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
  }

  ngAfterViewInit(): void {
    this.allDiscountRequests.ngOnInit();
  }

  getDiscountRequestStats() {
    this.store.dispatch(DiscountActions.StatLoading({ payload: true }));
    this.store.dispatch(DiscountActions.GetDiscountRequestStats());
  }

  onTabChange($event: any): void {
    if ($event.index === 0) {
      this.allDiscountRequests.ngOnInit();
    } else if ($event.index === 1) {
      this.approvedDiscountRequests.ngOnInit();
    } else if ($event.index === 2) {
      this.pendingDiscountRequests.ngOnInit();
    } else {
      this.declinedDiscountRequests.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.getDiscountRequestSub) {
      this.getDiscountRequestSub.unsubscribe();
    }
  }
}
