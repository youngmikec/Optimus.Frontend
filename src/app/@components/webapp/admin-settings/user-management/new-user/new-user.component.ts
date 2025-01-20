import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  newUserForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewUserComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildNewUserForm();
  }

  buildNewUserForm() {
    this.newUserForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      department: [null, [Validators.required]],
    });
  }

  get newUserFormControls() {
    return this.newUserForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'firstName' &&
      this.newUserFormControls['firstName'].hasError('required')
    ) {
      return `Please enter first name`;
    } else if (
      instance === 'lastName' &&
      this.newUserFormControls['lastName'].hasError('required')
    ) {
      return `Please enter last name`;
    } else if (
      instance === 'email' &&
      this.newUserFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.newUserFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'role' &&
      this.newUserFormControls['role'].hasError('required')
    ) {
      return `Please select role`;
    } else if (
      instance === 'department' &&
      this.newUserFormControls['department'].hasError('required')
    ) {
      return `Please enter department`;
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
