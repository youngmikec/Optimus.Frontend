import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  toggleSidebar = new Subject<boolean>();
  openSidebar = new Subject<boolean>();
  closeSidebar = new Subject<boolean>();

  constructor() {}
}
