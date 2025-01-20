import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss'],
})
export class TableControlsComponent implements OnInit {
  public searchControl: FormControl = new FormControl();

  @Input() placeholder: string = 'Search...';
  @Input() createButtonLabel: string = 'Create';

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() create: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.searchListener();
  }

  searchListener() {
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(800))
      .subscribe({
        next: (searchValue: string) => this.search.emit(searchValue),
      });
  }

  triggerCreate() {
    this.create.emit(null);
  }
}
