import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITableColumn, ITableView } from '../../interfaces/tableView.interface';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as TableViewActions from 'src/app/@core/stores/table-view/table-view.actions';
import { Store } from '@ngrx/store';

interface IDialogData {
  tableView: ITableView;
}

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnInit {
  tableName: string = '';
  isLoading: boolean = false;
  isApplying: boolean = false;
  title: string = 'Select Table View Columns';
  description: string = '';
  tableView!: ITableView;
  columns: ITableColumn[] = [];
  selectedColumns: ITableColumn[] = [];
  tableViewsForm!: FormGroup;

  constructor(
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TableViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) {}

  ngOnInit(): void {
    this.tableView = this.data.tableView;
    this.tableName = this.tableView.tableViewName;
    if (typeof this.data.tableView.tableColumns === 'string') {
      const parsedColumns = JSON.parse(this.data.tableView.tableColumns);
      this.columns = parsedColumns;
      this.selectedColumns = parsedColumns;
    } else {
      this.columns = this.data.tableView.tableColumns;
      this.selectedColumns = this.data.tableView.tableColumns;
    }
    this.description = this.data.tableView.description;
    if (this.columns.length) {
      this.buildForm();
    }
  }

  buildForm() {
    const formControlGroups: any = {};
    this.columns.forEach((item: ITableColumn) => {
      formControlGroups[item.propertyName] = [item.isSelected];
    });
    this.tableViewsForm = this.fb.group({ ...formControlGroups });
  }

  handleCheckedChange($event: any, column: ITableColumn) {
    const newTableColumns = this.selectedColumns.map((item: ITableColumn) => {
      return item.propertyName === column.propertyName
        ? { ...item, isSelected: $event.checked }
        : item;
    });

    this.selectedColumns = newTableColumns;
    // Update the form control
    this.tableViewsForm.patchValue({
      [`${column.propertyName}`]: $event.checked,
    });
  }

  onSubmit(): void {
    // set active table view
    const payload: ITableView = {
      ...this.tableView,
      tableColumns: this.selectedColumns,
    };
    this.store.dispatch(
      TableViewActions.SetActiveTableViews({
        payload: {
          view: payload,
        },
      })
    );
    this.closeDialog();
    // send to backend for storage.
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
