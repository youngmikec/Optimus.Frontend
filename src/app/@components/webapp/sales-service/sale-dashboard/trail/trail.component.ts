import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss'],
})
export class TrailComponent {
  @Output() closeTrail: EventEmitter<'trail'> = new EventEmitter();
  constructor() {}

  closeTray() {
    this.closeTrail.emit('trail');
  }
}
