import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss'],
})
export class PopupModalComponent {
  @Input() headerText: string = 'Deactivate "5" Partners';
  @Input() actionType: string = 'Deactivate';
  constructor() {}
}
