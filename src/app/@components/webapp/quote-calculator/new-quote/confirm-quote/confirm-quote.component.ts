import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';

@Component({
  selector: 'app-confirm-quote',
  templateUrl: './confirm-quote.component.html',
  styleUrls: ['./confirm-quote.component.scss'],
})
export class ConfirmQuoteComponent implements OnInit {
  isLoading!: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmQuoteComponent>,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
  }

  confirmQuote() {
    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationQuotesActions.ConfirmApplicationQuotes({
        payload: {
          id: this.data?.quoteData?.id,
        },
      })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
