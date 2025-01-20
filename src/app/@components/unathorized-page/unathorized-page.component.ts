import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unathorized-page',
  templateUrl: './unathorized-page.component.html',
  styleUrls: ['./unathorized-page.component.scss'],
})
export class UnathorizedPageComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
    this.location.back();
  }
}
