import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditPhaseConfigComponent } from './edit-phase-config/edit-phase-config.component';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as PhaseActions from 'src/app/@core/stores/phases/phase.actions';
import * as PhaseSelectors from 'src/app/@core/stores/phases/phase.selector';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { MatSort } from '@angular/material/sort';

export interface TableData {
  Phase: string;
  duration: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

@Component({
  selector: 'app-phase-config',
  templateUrl: './phase-config.component.html',
  styleUrls: ['./phase-config.component.scss'],
})
export class PhaseConfigComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'duration',
    // 'description',
    'frequency',
    'lastModifiedDate',
    'lastModifiedBy',
    'actions',
  ];
  dataSource: any;
  totalRecords!: number;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  private subsription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getPhases();
  }

  getPhases() {
    this.store.dispatch(PhaseActions.loadPhases());

    this.subsription.add(
      this.store
        .select(PhaseSelectors.phasesSuccessSelector)
        .pipe(filter((result) => !!result))
        .subscribe({
          next: (resp: any) => {
            const sorted = [...resp].sort(
              (a: any, b: any) =>
                new Date(b.createdDate).getTime() -
                new Date(a.createdDate).getTime()
            );
            this.dataSource = new MatTableDataSource(sorted);

            setTimeout(() => {
              // this.dataSource!.paginator = this.paginator;
              // this.dataSource!.sort = this.sort;
              this.totalRecords = resp.totalCount;
            });
          },
        })
    );
  }

  getPhaseDurationDescription(duration: number): string {
    switch (duration) {
      case 2:
        return 'Day';
      case 1:
        return 'Week';
      case 0:
        return 'Month';
      default:
        return 'Month';
    }
  }

  onEditPhase(phase: any) {
    this.dialog.open(EditPhaseConfigComponent, {
      data: {
        phase,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subsription) this.subsription.unsubscribe();
  }
}
