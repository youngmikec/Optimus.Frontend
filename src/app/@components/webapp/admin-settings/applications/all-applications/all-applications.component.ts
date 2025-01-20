import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
//import { ApplicationTable } from '../applications.interface';
import { CreateApplicationsComponent } from '../create-applications/create-applications.component';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicantsActions from 'src/app/@core/stores/applicants/applicants.actions';
import * as applicantsSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import { MatSort } from '@angular/material/sort';

import { select, Store } from '@ngrx/store';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

// const ELEMENT_DATA: ApplicationTable[] = new Array(10).fill({
//   status: 1,
//   applicant_name: 'Junaid Omowunmi',
//   phone_number: '+234 903 123 5432',
//   createdBy: 'Junaid Omowunmi',
//   createdAt: new Date(Date.now()),
//   updatedAt: new Date(Date.now()),
//   updatedBy: 'Junaid Omowunmi',
//   isActive: false,
// });

@Component({
  selector: 'app-all-applications',
  templateUrl: './all-applications.component.html',
  styleUrls: ['./all-applications.component.scss'],
})
export class AllApplicationsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'applicant_name',
    'phone_number',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'status',
    'actions',
  ];
  // dataArray = ELEMENT_DATA;
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize: number = 0;
  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;
  //@ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  totalRecords!: number;
  getAllApplicantsSub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.totalSize = this.dataArray.length;

    this.manageAllApplicants();
  }

  getAllApplicants() {
    this.store.dispatch(
      ApplicantsActions.GetAllApplicants({
        payload: {
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  manageAllApplicants() {
    this.getAllApplicants();

    this.getAllApplicantsSub = this.store
      .pipe(select(applicantsSelectors.getAllApplicants))
      .subscribe((resData) => {
        if (resData) {
          const modifiedApplicants: any[] = [];

          resData?.data.forEach((applicant: any) => {
            const modifiedapplicant = {
              ...applicant,
              createdDate: new Date(applicant.createdDate).getTime(),
              lastModifiedDate: new Date(applicant.lastModifiedDate).getTime(),
            };

            modifiedApplicants.push(modifiedapplicant);
          });

          const sortedApplicants = modifiedApplicants.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedApplicants);

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            // this.totalRecords = resData;
          });
        }
      });
  }
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
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

  // onPaginationChange({ pageIndex, pageSize }: any): void {
  //   const skip = pageIndex * pageSize;
  //   const take = pageIndex > 0 ? (pageIndex + 1) * pageSize : pageSize;

  //   this.getAllApplicants();
  // }

  onCreateApplicant(instance: 'create' | 'update', applicantData?: any) {
    this.dialog.open(CreateApplicationsComponent, {
      data: {
        instance: instance,
        applicant: applicantData,
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
      panelClass: 'opt-dialog',
    });
  }

  onToggle(row: any) {
    if (row.status === 1) {
      this.store.dispatch(
        ApplicantsActions.DeactivateApplicant({
          payload: {
            id: row.id,
          },
          paginationData: {
            skip: this.globalSkip,
            take: this.globalTake,
          },
        })
      );
    } else if (row.status === 3) {
      this.store.dispatch(
        ApplicantsActions.ActivateApplicant({
          payload: {
            id: row.id,
          },
          paginationData: {
            skip: this.globalSkip,
            take: this.globalTake,
          },
        })
      );
    }
  }
}
