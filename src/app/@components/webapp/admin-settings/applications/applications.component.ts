import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateApplicationsComponent } from './create-applications/create-applications.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent {
  constructor(private dialog: MatDialog) {}
  onCreateApplicant(instance: 'create' | 'update', applicantData?: any) {
    this.dialog.open(CreateApplicationsComponent, {
      data: {
        instance: instance,
        department: applicantData,
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
      panelClass: 'opt-dialog',
    });
  }
}
