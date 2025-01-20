import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentConfigurationsActions from 'src/app/@core/stores/documentConfiguration/documentConfiguration.actions';
import * as DocumentConfigurationsSelectors from 'src/app/@core/stores/documentConfiguration/documentConfiguration.selectors';

@Component({
  selector: 'app-document-configuration',
  templateUrl: './document-configuration.component.html',
  styleUrls: ['./document-configuration.component.scss'],
})
export class DocumentConfigurationComponent implements OnInit, OnDestroy {
  documentConfig!: string[];

  displayedColumns: string[] = [
    'configurationQuestion',
    'createdDate',
    'createdBy',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  totalRecords!: number;
  private getAllJobTitleSub!: Subscription;
  permissions: boolean[] = [];
  recordToDelete: any;

  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.manageAllDocumentConfig();
  }

  getDocConfigurations(
    skip = this.globalSkip ? this.globalSkip : DefaultPagination.skip,
    take = this.globalTake ? this.globalTake : DefaultPagination.take
  ) {
    this.store.dispatch(
      DocumentConfigurationsActions.GetAllDocumentConfigurations({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllDocumentConfig() {
    this.getDocConfigurations();

    this.getAllJobTitleSub = this.store
      .select(DocumentConfigurationsSelectors.getAllDocumentConfigurations)
      .pipe(filter((resp) => !!resp))
      .subscribe((resData: any) => {
        const sorted = [...resData.pageItems].sort(
          (a: any, b: any) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );

        this.dataSource = new MatTableDataSource(sorted);
        this.totalRecords = resData.totalCount;
      });
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource!.data);
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

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;

    this.getDocConfigurations(this.globalSkip, this.globalTake);
  }

  onCreateEditDocConfig() {
    this.router.navigate(['document-questions'], { relativeTo: this.route });
  }

  onChangeDocConfigStatus(row: any) {
    if (row.status === 1) {
      this.store.dispatch(
        DocumentConfigurationsActions.DeactivateDocumentConfiguration({
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
        DocumentConfigurationsActions.ActivateDocumentConfiguration({
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

  deleteRecord() {
    this.store.dispatch(
      DocumentConfigurationsActions.DeleteDocumentConfiguration({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
        },
        paginationData: {
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Document Configuration',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllJobTitleSub) {
      this.getAllJobTitleSub.unsubscribe();
    }
  }
}
