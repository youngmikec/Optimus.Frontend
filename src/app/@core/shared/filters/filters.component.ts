import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  usableData!: any;

  selectedOption: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FiltersComponent>
  ) {}

  ngOnInit(): void {
    this.usableData = this.data;
  }

  onOptionChange({ value }: any) {
    this.selectedOption = value;
  }

  submitAndClose() {
    const returnData = {
      name: this.usableData.name,
      value: this.selectedOption,
    };

    this.dialogRef.close(returnData);
  }
}
