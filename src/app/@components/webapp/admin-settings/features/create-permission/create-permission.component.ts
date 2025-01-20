import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss'],
})
export class CreatePermissionComponent implements OnInit {
  createPermissionForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreatePermissionComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildCreatePermissionForm();
  }

  buildCreatePermissionForm() {
    this.createPermissionForm = this.fb.group({
      permission_name: [null, [Validators.required]],
      feature: [null, [Validators.required]],
    });
  }

  get createPermissionFormControls() {
    return this.createPermissionForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'permission_name' &&
      this.createPermissionFormControls['permission_name'].hasError('required')
    ) {
      return `Please enter permission's name`;
    } else if (
      instance === 'feature' &&
      this.createPermissionFormControls['feature'].hasError('required')
    ) {
      return 'Select a feature';
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
