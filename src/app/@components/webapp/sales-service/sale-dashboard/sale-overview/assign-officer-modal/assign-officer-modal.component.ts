import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../../@core/stores/app.reducer';
import * as SalesSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as SalesActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import {
  IALL_OFFICERS_BY_ROLE,
  IEDIT_ASSIGNED_OFFICERS,
  IMAIN_OFFICER,
  ISUPPORTING_OFFICER,
  OfficerType,
} from 'src/app/@core/models/sales';
import { Subscription } from 'rxjs';
import { OfficerTypes } from 'src/app/@core/enums/sales.enum';

@Component({
  selector: 'app-assign-officer-modal',
  templateUrl: './assign-officer-modal.component.html',
  styleUrls: ['./assign-officer-modal.component.scss'],
})
export class AssignOfficerModalComponent implements OnInit, OnDestroy {
  public officerForm!: FormGroup;
  allOfficersByRole: IALL_OFFICERS_BY_ROLE[] | null = null;
  supportingOfficers: IALL_OFFICERS_BY_ROLE[] | null | undefined = null;
  private subscription = new Subscription();
  mainOfficer: IMAIN_OFFICER;
  supportingOfficer: ISUPPORTING_OFFICER;
  mainOfficerId: string = '';
  supportingOfficerId: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignOfficerModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      officerType: OfficerType;
      applicantId: number;
      userId: number;
      mainOfficer: IMAIN_OFFICER[];
      supportOfficer: ISUPPORTING_OFFICER[];
      id: number;
    },
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {
    this.initializeForm();
    this.mainOfficer = data.mainOfficer[0];
    this.supportingOfficer = data.supportOfficer[0];
  }

  ngOnInit(): void {
    this.getOfficers();
  }

  changeOfficer({ value }: any, roleType: string) {
    if (roleType === 'primary') {
      this.mainOfficerId = value;
      this.getSupportingOfficers();
      return;
    }
    this.supportingOfficerId = value;
  }

  getSupportingOfficers() {
    if (this.mainOfficerId) {
      this.supportingOfficers = this.allOfficersByRole?.filter(
        (item: IALL_OFFICERS_BY_ROLE) => item.userId !== this.mainOfficerId
      );
    } else {
      this.supportingOfficers = this.allOfficersByRole;
    }
  }

  initializeForm() {
    this.officerForm = this.fb.group({
      message: new FormControl(''),
    });

    switch (this.data.officerType) {
      case 'CMA':
        this.officerForm.addControl('primaryCMA', new FormControl(''));
        this.officerForm.addControl('supportingCMA', new FormControl(''));
        break;
      case 'DMS':
        this.officerForm.addControl('primaryDMS', new FormControl());
        this.officerForm.addControl('supportingDMS', new FormControl());
        break;
      case 'DPO':
        this.officerForm.addControl('primaryDPO', new FormControl());
        this.officerForm.addControl('supportingDPO', new FormControl());
        break;
      case 'DSO':
        this.officerForm.addControl('primaryDSO', new FormControl());
        this.officerForm.addControl('supportingDSO', new FormControl());
        break;
      case 'DAO':
        this.officerForm.addControl('primaryDAO', new FormControl());
        this.officerForm.addControl('supportingDAO', new FormControl());
        break;
    }
  }

  getOfficers(): void {
    this.dialogRef.afterOpened().subscribe({
      next: (data) => {
        this.store.dispatch(
          SalesActions.GetAssignedOfficersByRole({
            officerRole: this.data.officerType,
          })
        );
      },
    });

    this.subscription.add(
      this.store
        .select(SalesSelectors.getOfficersByRole)
        .subscribe((data: IALL_OFFICERS_BY_ROLE[] | null) => {
          if (data) {
            this.allOfficersByRole = data;
          }
        })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateOfficer() {
    this.closeDialog();
    const payload: IEDIT_ASSIGNED_OFFICERS = {
      id: this.data.id,
      applicationId: this.data.applicantId,
      primaryOfficerId: this.mainOfficerId,
      supportOfficerId: this.supportingOfficerId,
      message: this.officerForm.controls['message'].value,
      role: this.setOfficerRole(this.data.officerType),
      roleString: this.data.officerType,
    };

    this.store.dispatch(SalesActions.EditAssignedOfficer(payload));
  }

  setOfficerRole(officerType: string): number | undefined {
    if (Object.values(OfficerTypes).includes(officerType as any)) {
      return OfficerTypes[officerType as keyof typeof OfficerTypes];
    }
    return undefined;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
