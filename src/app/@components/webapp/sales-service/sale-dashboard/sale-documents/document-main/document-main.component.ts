import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-document-main',
  templateUrl: './document-main.component.html',
  styleUrls: ['./document-main.component.scss'],
})
export class DocumentMainComponent {
  @Output() currateList: EventEmitter<null> = new EventEmitter();

  constructor() {}

  currateDocList() {
    this.currateList.emit(null);
  }
}
