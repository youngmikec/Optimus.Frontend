import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as PartnerActions from 'src/app/@core/stores/partners/partners.actions';
import { IACTIVATION_MODAL_DATA } from 'src/app/@core/models/partners.model';

@Component({
  selector: 'app-activation-modal',
  templateUrl: './activation-modal.component.html',
  styleUrls: ['./activation-modal.component.scss'],
})
export class ActivationModalComponent implements OnInit {
  modalInfo!: IACTIVATION_MODAL_DATA;
  isLoading!: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ActivationModalComponent>,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.modalInfo = this.data;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changeMultiplePartnerStatus(): void {
    const payload = this.modalInfo.partnersForUpdate;
    payload.action = this.modalInfo.actionType === 'Activate' ? 1 : 3;
    this.store.dispatch(
      PartnerActions.ChangeMultiplePartnerStatus({ payload })
    );
    this.closeDialog();
  }
}
