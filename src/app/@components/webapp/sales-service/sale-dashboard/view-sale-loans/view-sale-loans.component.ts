import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
// import * as SaleServiceSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import { SalesLoanService } from 'src/app/@core/services/sales-loan.service';
import { SaleServiceEffects } from 'src/app/@core/stores/sale-service/sale-service.effects';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-sale-loans',
  templateUrl: './view-sale-loans.component.html',
  styleUrls: ['./view-sale-loans.component.scss'],
})
export class ViewSaleLoansComponent implements OnInit, OnDestroy {
  @Input() loanData: any;
  repaymentInfo!: any;
  @Output() closeLoan: EventEmitter<'activities'> = new EventEmitter();

  private subscription = new Subscription();
  constructor(
    private saleLoanService: SalesLoanService,
    private store: Store<fromApp.AppState>,
    private saleServiceEffects: SaleServiceEffects
  ) {}

  ngOnInit(): void {
    this.manageViewLoan();
  }

  manageViewLoan() {
    this.getLoanInitially();
    this.getLoanById();
    this.getLoanRepaymentById();
  }

  getLoanInitially() {
    this.saleLoanService.currentMessage.subscribe((data) => {
      if (data) {
        this.loanData = data;
      }
    });
  }

  getLoanById() {
    this.store.dispatch(
      SaleServiceActions.GetSaleLoanById({
        payload: {
          id: this.loanData!.id,
        },
      })
    );

    this.subscription.add(
      this.saleServiceEffects.getSalesLoanById$.subscribe((resData) => {
        if (resData) {
          this.repaymentInfo = resData;
        }
      })
    );
  }

  getLoanRepaymentById() {
    this.store.dispatch(
      SaleServiceActions.GetSaleLoanRepaymentById({
        payload: {
          id: this.loanData!.id,
        },
      })
    );

    this.subscription.add(
      this.saleServiceEffects.getSalesLoanRepaymentById$.subscribe(
        (resData) => {
          if (resData) {
            this.repaymentInfo = resData;
          }
        }
      )
    );
  }

  closeTray() {
    this.saleLoanService.changeMessage(null);
    this.closeLoan.emit('activities');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.saleLoanService.changeMessage(null);
      this.subscription.unsubscribe();
    }
  }
}
