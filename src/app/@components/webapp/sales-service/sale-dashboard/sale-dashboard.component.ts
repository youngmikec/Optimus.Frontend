import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, shareReplay } from 'rxjs';
import { slideInOutFromRight } from 'src/app/@core/animations/animation';
import {
  // PhasesEnum,
  SaleOverviewComponent,
} from './sale-overview/sale-overview.component';
import { MatTabGroup } from '@angular/material/tabs';
import * as fromApp from '../../../../@core/stores/app.reducer';
import { Store } from '@ngrx/store';
import { getGeneralIsLoading } from 'src/app/@core/stores/general/general.selectors';
import * as ApplicantActions from '../../../../@core/stores/applicants/applicants.actions';
import * as ApplicantSelector from '../../../../@core/stores/applicants/applicants.selectors';

type SalesActionType = 'comments' | 'trail' | 'activities' | 'loan' | null;

@Component({
  selector: 'app-sale-dashboard',
  templateUrl: './sale-dashboard.component.html',
  styleUrls: ['./sale-dashboard.component.scss'],
  animations: [slideInOutFromRight],
})
export class SaleDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('salesOverview') saleOverviewRef!: SaleOverviewComponent;
  @ViewChild('tabs') tabsRef!: MatTabGroup;

  // private individualLoanData: any;
  private subscription = new Subscription();

  public extras: any;
  public activeTabIndex: number = 0;
  public salesActions: SalesActionType = null;
  public isLoading: Observable<boolean> =
    this.store.select(getGeneralIsLoading);

  public applicantId: number = parseInt(
    this.route.snapshot.paramMap.get('applicantId')!
  );

  public applicationId: number = parseInt(
    this.route.snapshot.paramMap.get('applicationId')!
  );
  public applicant$: Observable<any> = this.store
    .select(ApplicantSelector.getSingleApplicants)
    .pipe(shareReplay());

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {
    const tabIndex = this.route.snapshot.queryParamMap.get('tabIndex');
    tabIndex && (this.activeTabIndex = parseInt(tabIndex));
  }

  ngOnInit(): void {
    this.getApplicantDetails();
  }

  getApplicantDetails() {
    this.store.dispatch(
      ApplicantActions.GetSingleApplicants({
        payload: { id: this.applicantId },
      })
    );
  }

  changeTab(index: number) {
    const currentPhase = this.saleOverviewRef.getCurrentPhase;

    // Prevents viewing document tab if coming from loans and notes tabs
    if ((this.activeTabIndex === 2 || this.activeTabIndex === 3) && index === 1)
      this.tabsRef.selectedIndex = this.activeTabIndex;

    // All application phases has been completed
    if (!currentPhase) this.tabsRef.selectedIndex = 0;

    // if (index === 1) {
    //   const { phase } = currentPhase;
    //   if (phase === PhasesEnum.ONBOARDING) this.tabsRef.selectedIndex = 0;
    //   else {
    //     this.extras = currentPhase;
    //     this.activeTabIndex = index;
    //   }
    // } else this.activeTabIndex = index;

    this.extras = currentPhase;
    this.activeTabIndex = index;
  }

  routeTab(route: any) {
    // this.applicationId = route.id;
    if (typeof route === 'number') this.activeTabIndex = route;
    else {
      this.activeTabIndex = route.tabIndex;
      this.extras = route.extras;
    }
  }

  toggleAction(action: SalesActionType) {
    if (this.salesActions === action) {
      this.salesActions = null;
      return;
    }

    this.salesActions = action;
  }

  toggleActivities(minimize: boolean): void {
    if (minimize) {
      this.routeTab(0);
      this.toggleAction('activities');
      return;
    }

    this.routeTab(4);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
