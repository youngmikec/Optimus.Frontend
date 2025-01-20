import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  ActionEventTypes,
  IActionButton,
  IPagination,
  ITableColumn,
} from 'src/app/@core/models/table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns!: ITableColumn[];
  @Input() actionButtons!: IActionButton[];
  @Input() pagination!: IPagination;
  @Input() set data(payload: any) {
    this.dataSource = new MatTableDataSource(payload);
  }
  selection = new SelectionModel<any>(true, []);

  // @Output() checkboxCheckEmit: EventEmitter<any> = new EventEmitter();
  @Output() actionTrigger: EventEmitter<{
    action: ActionEventTypes;
    record: any;
  }> = new EventEmitter();
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter();

  public displayedColumns!: string[];
  public dataSource!: MatTableDataSource<any>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'])
      this.displayedColumns = changes['columns'].currentValue.map(
        (col: ITableColumn) => col.key
      );
  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((col) => col.key);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource!.data);
  }

  singleCheck(row: any) {
    this.selection.toggle(row);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  initiateAction(action: ActionEventTypes, record: any) {
    this.actionTrigger.emit({ action, record });
  }

  paginationChange(event: PageEvent) {
    this.paginate.emit(event);
  }
}
