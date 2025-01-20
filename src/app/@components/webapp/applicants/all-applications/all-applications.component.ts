import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
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
import { PermissionService } from 'src/app/@core/services/permission.service';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-all-applications',
  templateUrl: './all-applications.component.html',
  styleUrls: ['./all-applications.component.scss'],
})
export class AllApplicationsComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'applicantId',
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
  //@ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  totalRecords!: number;
  getAllApplicantsSub!: Subscription;

  globalSkip!: number | undefined;
  globalTake!: number | undefined;
  recordToDelete: any;

  permissions: boolean[] = [];
  @Input() searchValue: any;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Applicant');
    });

    this.manageAllApplicants();
  }

  ngOnChanges(): void {
    if (this.searchValue) {
      this.search(this.searchValue);
    }
  }

  search(input: string) {
    this.dataSource!.filter = input?.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  getAllApplicants(
    skip = this.globalSkip ? this.globalSkip : DefaultPagination.skip,
    take = this.globalTake ? this.globalTake : DefaultPagination.take
  ) {
    this.store.dispatch(
      ApplicantsActions.GetAllApplicants({
        payload: { skip: skip, take: take },
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

          resData?.data?.forEach((applicant: any) => {
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

            this.totalRecords = resData.totalCount;
          });
        }
      });
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

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;

    this.getAllApplicants();
  }

  onCreateApplicant(instance: 'create' | 'update', applicantData?: any) {
    this.dialog.open(CreateApplicationsComponent, {
      data: {
        instance: instance,
        applicant: applicantData,
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
      panelClass: 'opt2-dialog',
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
            skip: this.globalSkip ? this.globalSkip : DefaultPagination.skip,
            take: this.globalTake ? this.globalTake : DefaultPagination.take,
          },
        })
      );
    } else if (row.status === 2) {
      this.store.dispatch(
        ApplicantsActions.ActivateApplicant({
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
      ApplicantsActions.DeleteApplicant({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
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
        entityName: 'Applicant',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }
}
