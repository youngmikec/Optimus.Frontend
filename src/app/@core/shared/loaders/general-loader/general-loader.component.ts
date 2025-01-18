import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-general-loader',
  templateUrl: './general-loader.component.html',
  styleUrls: ['./general-loader.component.scss'],
})
export class GeneralLoaderComponent {
  @Input() loaderText: string = 'Loading... Please wait';
  @Input() logoVariation: number = 1;

  constructor() {}
}
