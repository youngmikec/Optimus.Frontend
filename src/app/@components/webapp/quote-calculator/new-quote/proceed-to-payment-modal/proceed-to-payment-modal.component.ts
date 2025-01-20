import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as QuoteCalcActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import { IUploadDocQuoteCalc } from 'src/app/@core/models/sales';
import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import * as ApplicationQuoteSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { IApplicationQuote } from 'src/app/@core/interfaces/quoteCalculator.interface';
interface PaymentPlan {
  id: number;
  downPayment: number;
  duration: number;
  name: number;
  description: number;
}

@Component({
  selector: 'app-proceed-to-payment-modal',
  templateUrl: './proceed-to-payment-modal.component.html',
  styleUrls: ['./proceed-to-payment-modal.component.scss'],
})
export class ProceedToPaymentModalComponent implements OnInit, OnDestroy {
  selectedPaymentPlan!: PaymentPlan;
  view: 'authorisation' | 'readyToBuy' | 'uploadDoc' = 'readyToBuy';
  isLoading!: Observable<boolean>;
  countryFeeToDisplay = this.data?.hasDiscountApplied
    ? this.data?.netAmount
    : this.data?.countryFeeAmount;

  public docExist$ = new BehaviorSubject<boolean>(false);
  private subscription = new Subscription();
  private _authorizationStatus: number | undefined = undefined;

  public loanAmount!: number;
  public fileName: string = 'Nill';
  public fileSize: string = '0mb';
  public progressValue: number = 0;
  public blobFile: any = '';
  public blob: any = '';
  selectedApplicationQuote!: IApplicationQuote;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private store: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<ProceedToPaymentModalComponent>,
    private notificationService: NotificationService,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);
    this.selectedApplicationQuote = this.data.applicationQuoteId;
    this.assignView();
    this.getQuoteDetails();

    // eslint-disable-next-line no-console
    console.log('this.data', this.data);
  }

  public get authorizationStatus(): number | undefined {
    return this._authorizationStatus;
  }

  goToCreateNewInvoice() {
    this.dialogRef.close();

    this.router.navigate([
      `app/calculator/quote/quote-invoice/${this.data.applicationQuoteId}/create`,
    ]);
  }

  goToCountry() {
    this.dialogRef.close();

    this.router.navigate([
      `app/admin-settings/country-setup/dashboard/${this.data.country.id}/${this.data.country.name}`,
    ]);
  }

  getQuoteDetails(): void {
    this.store
      .select(ApplicationQuoteSelector.getApplicationQuoteById)
      .subscribe((data) => {
        if (data) {
          this._authorizationStatus = data?.authorizationStatus;
        }
      });
  }

  // onFileChangeOne(event: any): void {
  //   const file = event.target.files[0];
  //   this.blob = file;
  //   const allowedTypes = [
  //     'image/jpeg',
  //     'application/pdf',
  //     'application/msword',
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //   ];

  //   if (allowedTypes.includes(file.type)) {
  //     const reader = new FileReader();
  //     const chunkSize = 1024 * 1024; // 1MB chunk size
  //     let currentPosition = 0;
  //     const fileData: any[] = [];

  //     this.docExist$.next(true);

  //     reader.onloadend = () => {
  //       if (reader.readyState === FileReader.DONE) {
  //         const chunkData = new Uint8Array(reader.result as ArrayBuffer);
  //         fileData.push(chunkData);
  //         this.fileName = file.name;

  //         this.fileSize = this.checkFileSize(file);
  //         currentPosition += chunkSize;

  //         this.progressValue = Math.min(
  //           Math.round((currentPosition / file.size) * 100),
  //           100
  //         );

  //         if (currentPosition < file.size) {
  //           readChunk(); // Read the next chunk
  //         } else {
  //           // File reading is complete
  //           const binaryString = fileData.reduce(
  //             (acc, chunk) => acc + String.fromCharCode.apply(null, chunk),
  //             ''
  //           );
  //           this.blobFile = binaryString;
  //         }
  //       }
  //     };

  //     // Function to read the file in chunks
  //     const readChunk = () => {
  //       const end = Math.min(currentPosition + chunkSize, file.size);
  //       const blobChunk = file.slice(currentPosition, end);
  //       reader.readAsArrayBuffer(blobChunk);
  //     };

  //     readChunk(); // Start reading the file
  //   }
  // }

  checkFileSize(data: any): string {
    const dataSize = data.size;
    return `${(dataSize / 100000).toFixed(2)}mb`;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file.size > 5000000) {
      this.notificationFxn('File size must be less than 5mb', 'error');
      return;
    }
    this.fileName = file.name;
    const allowedTypes = [
      'image/jpeg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedTypes.includes(file.type)) {
      this.fileSize = this.checkFileSize(file);
      this.blob = file;
      this.progressValue = 100;
      this.docExist$.next(true);
      return;
    }

    this.notificationFxn('File must be of type jpeg, pdf or word ', 'error');
  }

  notificationFxn(message: string, state: 'error' | 'success'): void {
    const notification: Notification = {
      state: `${state}`,
      title: 'System Notification',
      message: `${message}`,
    };

    this.notificationService.openSnackBar(
      notification,
      `opt-notification-${state}`
    );
    return;
  }

  proceed(): void {
    if (this.view === 'uploadDoc') {
      const payload: IUploadDocQuoteCalc = {
        ApplicationQuoteId: this.data.applicationQuoteId,
        EngagementProfileDocument: this.blob,
      };
      this.store.dispatch(QuoteCalcActions.UploadDocument({ payload }));

      this.subscription.add(
        this.store
          .select(QuoteSelectors.QuoteDocIsUploaded)
          .subscribe((res: boolean | null) => {
            if (res) {
              this.dialogRef.close();
              this.navigateBack('authorisation');
            }
          })
      );
      return;
    }

    this.dialogRef.close();
    // this.router.navigate([
    //   `app/calculator/quote/quote-invoice/${this.data.applicationQuoteId}/create`,
    // ]);
    this.router.navigate([
      `app/calculator/quote/quote-invoice/${this.data.applicationQuoteId}/loan`,
    ]);
  }

  removeFxn(): void {
    this.docExist$.next(false);
    this.blobFile = '';
  }

  requestLoan() {
    if (!this.loanAmount || this.loanAmount === 0) return;
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      SaleServiceActions.RequestLoan({
        payload: {
          amount: this.loanAmount,
          description: '',
          applicationId: this.data.applicationId,
          name: this.data.applicantName,
        },
      })
    );
  }

  assignView(): void {
    this.view = this.data.view;
  }

  navigateBack(view: 'readyToBuy' | 'authorisation' | 'uploadDoc') {
    this.view = view;
  }

  closeDialog() {
    this.docExist$.next(false);
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
