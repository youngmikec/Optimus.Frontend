import {
  Component,
  Inject,
  // Renderer2,
  ElementRef,
} from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Notification } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: Notification,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef
  ) {}

  closeNotification() {
    this.elementRef.nativeElement.addEventListener('click', () => {
      this.snackBar.dismiss();
    });
  }
}
