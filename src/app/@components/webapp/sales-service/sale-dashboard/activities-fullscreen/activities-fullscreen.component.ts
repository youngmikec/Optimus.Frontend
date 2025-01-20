import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IACTIVITIES_BY_ID } from 'src/app/@core/models/sales';
import { MarkAsDoneComponent } from '../mark-as-done/mark-as-done.component';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../@core/stores/app.reducer';
import * as SaleSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
@Component({
  selector: 'app-activities-fullscreen',
  templateUrl: './activities-fullscreen.component.html',
  styleUrls: ['./activities-fullscreen.component.scss'],
})
export class ActivitiesFullscreenComponent implements OnInit {
  progressValue: number = 0;
  // activities: IActivities[] = [
  //   {
  //     title: 'Retrive document from client',
  //     document: 'Marriage Certificate',
  //     done: true,
  //   },
  //   {
  //     title: 'Retrive document from client',
  //     document: 'Marriage Certificate',
  //     done: false,
  //   },
  //   {
  //     title: 'Retrive document from client',
  //     document: 'Marriage Certificate',
  //     done: true,
  //   },
  // ];

  @Output() minimize: EventEmitter<boolean> = new EventEmitter();
  @Input() applicationId!: number;
  allActivities: IACTIVITIES_BY_ID = {
    progress: 0,
    query: [],
  };
  constructor(
    private dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getActivities();
  }

  minimizeFxn() {
    this.minimize.emit(true);
  }

  getActivities(): void {
    this.store
      .select(SaleSelectors.getActivities)
      .subscribe((resData: IACTIVITIES_BY_ID | null) => {
        if (resData) {
          this.allActivities = resData;
          this.progressValue = resData.progress;
        }
      });
  }

  markAsDone(id: number): void {
    this.dialog.open(MarkAsDoneComponent, {
      data: { id, applicationId: this.applicationId },
    });
  }
}
