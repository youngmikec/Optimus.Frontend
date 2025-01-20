import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
// import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
// import * as ApplicationQuoteActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
// import * as ApplicationQuoteSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';

@Component({
  selector: 'app-delete-quote-modal',
  templateUrl: './delete-quote-modal.component.html',
  styleUrls: ['./delete-quote-modal.component.scss'],
})
export class DeleteQuoteModalComponent implements OnInit {
  isLoading!: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<DeleteQuoteModalComponent>,
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA) private data: { quoteId: number; action: any }
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);
  }

  deleteQuote(): void {
    this.data.action();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
