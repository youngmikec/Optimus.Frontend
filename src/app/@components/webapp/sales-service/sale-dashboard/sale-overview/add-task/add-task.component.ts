import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  users: any[] = [];
  filteredUsers!: Observable<any[]>;
  addTaskForm!: FormGroup;
  selectedUser!: any;
  buttonLoading!: Observable<boolean>;

  minDate = new Date();

  constructor(
    // private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTaskComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.buttonLoading = this.store.select(
      GeneralSelectors.getGeneralIsLoading
    );

    // Initialize form
    this.createForm();
    this.getUsers();
  }

  getUsers() {
    this.users = this.data.users;
    this.filterUsers();
  }

  createForm() {
    this.addTaskForm = this.fb.group({
      title: [null, Validators.required],
      assignedTo: [null, Validators.required],
      dueDate: [null, Validators.required],
    });
  }

  onUserSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedUser = event.option.value;
    this.addTaskFormControl['assignedTo'].setValue(this.selectedUser.name);
  }

  get addTaskFormControl() {
    return this.addTaskForm.controls;
  }

  goToCreateNewInvoice() {
    this.dialogRef.close();
    // this.router.navigate(['/app/calculator/quote/quote-invoice/view']);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmitForm() {
    this.store.dispatch(
      GeneralActions.IsLoading({
        payload: true,
      })
    );

    const assignedToUserId = this.selectedUser
      ? this.selectedUser.userId
      : null;

    this.store.dispatch(
      SaleServiceActions.AddTask({
        payload: {
          applicationId: this.data.applicationId,
          assignedTo: assignedToUserId,
          title: this.addTaskFormControl['title'].value,
          dueDate: this.addTaskFormControl['dueDate'].value,
          closeOnSuccess: true,
        },
      })
    );
  }

  filterUsers() {
    this.filteredUsers = this.addTaskFormControl[
      'assignedTo'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.users!.filter((user) =>
      user.name.toLowerCase().includes(filterValue)
    );
  }
}
