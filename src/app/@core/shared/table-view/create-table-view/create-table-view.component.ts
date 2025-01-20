import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  ITableColumn,
  ITableView,
} from 'src/app/@core/interfaces/tableView.interface';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as TableViewActions from 'src/app/@core/stores/table-view/table-view.actions';
// import * as TableViewSelectors from 'src/app/@core/stores/table-view/table-view.selectors';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';

@Component({
  selector: 'app-create-table-view',
  templateUrl: './create-table-view.component.html',
  styleUrls: ['./create-table-view.component.scss'],
})
export class CreateTableViewComponent implements OnInit, OnDestroy {
  createTableViewForm: FormGroup;
  formMode: string = 'create';
  tableViewName: string = '';
  isLoading!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      formMode: string;
      tableView: ITableView;
      tableColumns: ITableColumn[];
    },
    private dialogRef: MatDialogRef<CreateTableViewComponent>
  ) {
    this.createTableViewForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(GeneralSelectors.getGeneralIsLoading)
    );
    this.formMode = this.data.formMode;
    this.tableViewName = this.data.tableView.tableViewName;
  }

  get createTableViewFormControls() {
    return this.createTableViewForm.controls;
  }

  getErrorMessage(control: string): string {
    let message: string = '';

    if (control === 'name') {
      message = 'Table Name is required';
    }
    if (control === 'description') {
      message = 'Description required';
    }
    return message;
  }

  onSubmit(): void {
    this.formMode === 'create'
      ? this.createTableView()
      : this.udpateTableView();
  }

  createTableView(): void {
    this.store.dispatch(TableViewActions.IsLoading({ payload: true }));
    this.store.dispatch(
      TableViewActions.CreateTableViewSetup({
        payload: {
          name: this.createTableViewForm.value.name,
          tableColumns: this.data.tableColumns,
          tableViewName: this.tableViewName,
          description: this.createTableViewForm.value.description,
          active: true,
          serialNumber: 1,
        },
      })
    );
  }

  udpateTableView(): void {
    this.store.dispatch(TableViewActions.IsLoading({ payload: true }));
    this.store.dispatch(
      TableViewActions.CreateTableViewSetup({
        payload: {
          name: this.createTableViewForm.value.name,
          tableColumns: this.data.tableColumns,
          tableViewName: this.tableViewName,
          description: this.createTableViewForm.value.description,
          active: true,
          serialNumber: 1,
        },
      })
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.createTableViewForm.reset();
    this.formMode = 'create';
  }
}
