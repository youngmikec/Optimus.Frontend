import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  editTaskForm!: FormGroup;
  users: any[] = [];
  filteredUsers!: Observable<any[]>;
  task = this.data.task;
  selectedUser!: any;
  buttonLoading!: Observable<boolean>;
  changed = false;

  minDate = new Date();

  constructor(
    // private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTaskComponent>
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.buttonLoading = this.store.select(
      GeneralSelectors.getGeneralIsLoading
    );

    this.createForm();

    this.getUsers();
  }

  getUsers() {
    this.users = this.data.users;
    this.filterUsers();
  }

  onUserSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedUser = event.option.value;
    this.editTaskFormControl['assignedTo'].setValue(this.selectedUser.name);
  }

  goToCreateNewInvoice() {
    this.dialogRef.close();
    // this.router.navigate(['/app/calculator/quote/quote-invoice/view']);
  }

  createForm() {
    this.editTaskForm = this.fb.group({
      title: [this.task.title, Validators.required],
      assignedTo: [this.task.assignedToName, Validators.required],
      dueDate: [this.task.dueDate, Validators.required],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get editTaskFormControl() {
    return this.editTaskForm.controls;
  }

  updateTask() {
    this.store.dispatch(
      GeneralActions.IsLoading({
        payload: true,
      })
    );

    const assignedToUserId = this.selectedUser
      ? this.selectedUser.userId
      : null;

    this.store.dispatch(
      SaleServiceActions.UpdateTask({
        payload: {
          assignedTo: !this.changed ? this.task.assignedTo : assignedToUserId,
          title: this.editTaskFormControl['title'].value,
          dueDate: this.editTaskFormControl['dueDate'].value,
          id: this.task.id,
          applicationId: this.data.applicationId,
        },
      })
    );
  }

  filterUsers() {
    this.filteredUsers = this.editTaskFormControl[
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
