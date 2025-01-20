import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { IACTIVITIES_BY_ID, IActivities } from 'src/app/@core/models/sales';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../@core/stores/app.reducer';
import * as SaleSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import { MarkAsDoneComponent } from '../mark-as-done/mark-as-done.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  @Output() closeActivities: EventEmitter<'activities'> = new EventEmitter();
  @Output() minimizeActivities: EventEmitter<boolean> = new EventEmitter();
  @Input() applicationId!: number;
  allActivities: IACTIVITIES_BY_ID = {
    progress: 0,
    query: [],
  };
  color: ThemePalette = 'primary';
  progressValue: number = 0;
  activities: IActivities[] = [
    {
      title: 'Retrive document from client',
      document: 'Marriage Certificate',
      done: true,
    },
    {
      title: 'Retrive document from client',
      document: 'Marriage Certificate',
      done: false,
    },
    {
      title: 'Retrive document from client',
      document: 'Marriage Certificate',
      done: true,
    },
  ];

  constructor(
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog
  ) {}

  closeTray() {
    this.closeActivities.emit('activities');
  }

  markAsDone(id: number): void {
    this.dialog.open(MarkAsDoneComponent, {
      data: { id, applicationId: this.applicationId },
    });
  }

  toggleActivities(): void {
    this.closeTray();
    this.minimizeActivities.emit(false);
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

  ngOnInit(): void {
    this.getActivities();
  }
}
