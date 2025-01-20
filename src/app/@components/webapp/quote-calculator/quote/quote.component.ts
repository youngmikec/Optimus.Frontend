import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { QuoteTableInterface } from '../quote-calculator.interface';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Subscription } from 'rxjs';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as ApplicationQuoteActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuoteSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import { Router } from '@angular/router';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
// import { NotificationService } from 'src/app/@core/services/notification.service';
import { FinancialStatementDialogComponent } from '../new-quote/financial-statement-dialog/financial-statement-dialog.component';
import { IApplicationQuote } from 'src/app/@core/interfaces/quoteCalculator.interface';
import { DeleteQuoteModalComponent } from '../new-quote/delete-quote-modal/delete-quote-modal.component';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
})
export class QuoteComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  dataSource: MatTableDataSource<QuoteTableInterface> | null = null;
  initialDataSource: MatTableDataSource<QuoteTableInterface> | null = null;
  selection = new SelectionModel<QuoteTableInterface>(true, []);

  globalSkip!: number;
  globalTake!: number;
  pageSize = DefaultPagination.take;

  totalRecords!: number;
  getAllQuoteSub!: Subscription;
  viewDocumentMode: boolean = false;

  displayedColumns: string[] = [
    'applicant_name',
    'country',
    'route',
    'createdDate',
    'createdBy',
    'lastModifiedDate',
    'lastModifiedBy',
    'quoteStatus',
    'actions',
  ];
  @Input() searchString: string | null = '';

  constructor(
    public dialog: MatDialog, // private notificationService: NotificationService
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.manageAllQuote();
    if (this.dataSource) {
      this.dataSource.sortingDataAccessor = (
        item: QuoteTableInterface,
        property: string
      ) => {
        switch (property) {
          case 'country':
          case 'applicant_name':
          case 'createdBy':
            return item[property].toLowerCase(); // Sort alphabetically, case-insensitive
          case 'createdDate':
            return new Date(item.createdDate).getTime(); // Sort by date (timestamp)
          default:
            return item[property];
        }
      };
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchString'] && this.dataSource) {
      this.search();
    }
  }

  getAllQuote(
    skip: number = this.globalSkip ? this.globalSkip : DefaultPagination.skip,
    take: number = this.globalTake ? this.globalTake : DefaultPagination.take
  ) {
    this.store.dispatch(
      ApplicationQuoteActions.GetAllApplicationQuotes({
        payload: { skip: skip, take: take },
      })
    );
  }

  activateOrDeactivateQuote(row: any) {
    if (row.status === 1) {
      this.store.dispatch(
        ApplicationQuoteActions.DeactivateApplicationQuotes({
          payload: {
            id: row.id,
          },
          paginationData: {
            skip: this.globalSkip ? this.globalSkip : DefaultPagination.skip,
            take: this.globalTake ? this.globalTake : DefaultPagination.take,
          },
        })
      );
    } else {
      this.store.dispatch(
        ApplicationQuoteActions.ActivateApplicationQuotes({
          payload: {
            id: row.id,
          },
          paginationData: {
            skip: this.globalSkip ? this.globalSkip : DefaultPagination.skip,
            take: this.globalTake ? this.globalTake : DefaultPagination.take,
          },
        })
      );
    }
  }

  deleteQuote(id: number) {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuoteActions.DeleteApplicationQuote({
        payload: {
          quoteId: id,
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  openDeleteModal(id: number): void {
    if (!id) return;
    this.dialog.open(DeleteQuoteModalComponent, {
      data: {
        quoteId: id,
        action: () => {
          this.deleteQuote(id);
        },
      },
    });
  }

  manageAllQuote() {
    this.getAllQuote();

    this.getAllQuoteSub = this.store
      .pipe(select(ApplicationQuoteSelector.getAllApplicationQuote))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedCountryList: any[] = [];

          resData?.data.forEach((quote: any) => {
            const modifiedConutry = {
              ...quote,
              createdDate: new Date(quote.createdDate).getTime(),
              lastModifiedDate: new Date(quote.lastModifiedDate).getTime(),
            };

            modifiedCountryList.push(modifiedConutry);
          });

          const sortedRoles = modifiedCountryList.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; // Descending order
          });

          this.dataSource = new MatTableDataSource(sortedRoles);
          this.initialDataSource = new MatTableDataSource(sortedRoles);
          // this.search();
          this.totalRecords = resData.totalCount;
        }
      });
  }

  search() {
    if (!this.searchString) {
      this.searchString = '';
    }
    this.dataSource!.filter = this.searchString?.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const name = data.name.toLowerCase();
        return name.includes(filter);
      };
    }

    // if (this.searchString === '') {
    //   console.log('here');

    //   this.dataSource = this.initialDataSource;
    // }
  }

  goToDashboard(id: number) {
    this.router.navigate(['/app/calculator/quote/quote-invoice', id]);
  }

  goToQuote(applicationId: number, applicationQuoteId: number) {
    // location.href = `/app/calculator/quote/builder/${applicationId}/edit/${applicationQuoteId}`;

    this.router.navigate([
      `/app/calculator/quote/builder/${applicationId}/edit/${applicationQuoteId}`,
    ]);
  }

  goToInvoice(applicationQuoteId: number) {
    this.router.navigate([
      `/app/calculator/quote/quote-invoice/${applicationQuoteId}/view`,
    ]);
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;

    this.getAllQuote();
  }

  downloadPdf(): void {}

  // viewFinancialDocument(quote: IApplicationQuote) {
  //   this.viewDocumentMode = true;
  //   const viewedquoteDocumentData = {
  //     fileName: 'Financial Statement receipt',
  //     applicantId: quote.application.applicantId,
  //     applicationQuoteId: quote.id,
  //     selectedApplicationQuote: quote,
  //   };
  //   this.dialog.open(FinancialStatementDialogComponent, {
  //     width: '65%',
  //     height: '100vh',
  //     position: {
  //       right: '0',
  //       top: '0',
  //     },
  //     data: viewedquoteDocumentData,
  //     disableClose: false,
  //   });
  // }

  viewFinancialDocument(quote: IApplicationQuote) {
    const viewedquoteDocumentData = {
      fileName: 'Financial Statement receipt',
      applicantId: quote.application.applicantId,
      applicationQuoteId: quote.id,
      selectedApplicationQuote: quote,
    };
    this.dialog.open(FinancialStatementDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: viewedquoteDocumentData,
      disableClose: false,
    });
  }

  ngOnDestroy(): void {
    if (this.getAllQuoteSub) {
      this.getAllQuoteSub.unsubscribe();
    }
  }
}
