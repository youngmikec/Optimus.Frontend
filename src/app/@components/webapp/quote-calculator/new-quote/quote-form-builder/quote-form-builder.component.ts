import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';

@Component({
  selector: 'app-quote-form-builder',
  templateUrl: './quote-form-builder.component.html',
  styleUrls: ['./quote-form-builder.component.scss'],
})
export class QuoteFormBuilderComponent implements OnInit, OnDestroy {
  // @ViewChild('curtain') divCurtain: ElementRef;
  displayStepper = false;
  isQuotePreviewAvailable = false;
  matSteps!: HTMLCollectionOf<HTMLElement> | any;
  isApplicationLoading!: Observable<boolean>;
  selectedContry!: any;
  selectedApplicationQuote!: any;
  refresh: boolean = false;
  expand: boolean = false;
  unsubscribe$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {
    this.isApplicationLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
  }

  ngOnInit() {
    this.getCountryById();
  }

  getSelectedIndex(properties: any) {
    if (
      properties.selectedIndex > 3 &&
      properties.selectedIndex === properties.stepArr.length - 1
    ) {
      this.isQuotePreviewAvailable = true;
    }
  }

  handleOnQuoteGenerated($event: any): void {
    if ($event) {
      this.selectedApplicationQuote = $event;
      this.refresh = true;
    }
  }

  getCountryById() {
    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(CountriesSelector.getCountryById)
      )
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedContry = res;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
