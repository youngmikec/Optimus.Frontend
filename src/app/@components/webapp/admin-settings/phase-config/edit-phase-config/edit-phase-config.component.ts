import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as PhaseActions from 'src/app/@core/stores/phases/phase.actions';
import * as PhaseSelectors from 'src/app/@core/stores/phases/phase.selector';

export enum PhaseDuration {
  Months = 0,
  Weeks = 1,
  Days = 2,
}

export interface PhaseOption {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-edit-phase-config',
  templateUrl: './edit-phase-config.component.html',
  styleUrls: ['./edit-phase-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditPhaseConfigComponent implements OnInit {
  phaseForm: FormGroup;
  phaseData: any = null;
  isLoading: Observable<boolean> = this.store.pipe(
    select(PhaseSelectors.isPhaseLoadingSelector)
  );

  durationOptions: PhaseOption[] = [
    {
      value: PhaseDuration.Months,
      viewValue: 'Months',
    },
    {
      value: PhaseDuration.Weeks,
      viewValue: 'Weeks',
    },
    {
      value: PhaseDuration.Days,
      viewValue: 'Days',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditPhaseConfigComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) {
    this.phaseForm = this.fb.group({
      duration: ['0', [Validators.required]],
      durationFrequency: [0, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.phaseData = this.data.phase;
  }

  onSubmit() {
    if (!this.phaseData) {
      const nofitcation: Notification = {
        message: 'Phase not found',
        state: 'error',
      };
      this.notificationService.openSnackBar(
        nofitcation,
        'opt-notification-error'
      );
      return;
    }

    const payload: any = {
      duration: parseInt(this.phaseForm.value.duration),
      durationFrequency: parseInt(this.phaseForm.value.durationFrequency),
      id: this.phaseData.id,
      name: this.phaseData.name,
      description: this.phaseData.description,
    };
    this.store.dispatch(PhaseActions.updatePhase({ ...payload }));
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
