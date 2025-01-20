import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as NotificationActions from 'src/app/@core/stores/notifications/notifications.action';
import * as NotificationSelectors from 'src/app/@core/stores/notifications/notifications.selectors';
import { NotificationMessageTemplate } from '../../models/notification-template.model';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss'],
})
export class NotificationDropdownComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('notificationMenu', { static: false })
  notificationMenu!: ElementRef<HTMLDivElement>;

  isLoading$!: Observable<boolean>;
  hasMore: boolean = false;
  showNotifications: boolean = false;
  activeTab: number = 1;
  numOfUnreadNotifications: number = 0;
  fetchTimeInterval: any;
  readAllTimeInterval: any;
  // globalSkip: number = 0;
  // globalTake: number = 99;
  // unreadCount: number = 0;
  notifications: NotificationMessageTemplate[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(NotificationSelectors.isLoading);
    this.monitorNotifications();
  }
  ngAfterViewInit(): void {
    this.monitorReadAllNotifications();
  }

  monitorNotifications() {
    this.fetchTimeInterval = setInterval(() => {
      // get all new notifications
      this.getAllNotifications();
    }, 5000);
  }

  monitorReadAllNotifications() {
    this.readAllTimeInterval = setInterval(() => {
      // read all notifications
      if (this.numOfUnreadNotifications > 0 && this.showNotifications) {
        this.readAllNotifications(this.notifications);
      }
    }, 10000);
  }

  unreadCount() {
    this.numOfUnreadNotifications = this.notifications.filter(
      (n) => n.notificationStatus === 2
    ).length; // 1 Read, 2 Unread.
  }

  getAllNotifications() {
    this.store.dispatch(NotificationActions.IsLoading({ payload: true }));
    this.store.dispatch(NotificationActions.GetAllNotifications());

    this.store
      .pipe(select(NotificationSelectors.allNotifications))
      .subscribe((resData: any) => {
        if (resData) {
          this.notifications = resData;
          this.unreadCount();
        }
      });
  }

  markAllAsRead(ids: number[]) {
    this.store.dispatch(
      NotificationActions.ReadAllNotifications({
        payload: {
          notificationIds: ids,
        },
      })
    );
  }

  readAllNotifications(notifications: NotificationMessageTemplate[]) {
    const notificationIds: number[] = notifications.map((item) => item.id);

    if (notificationIds.length > 0) {
      this.markAllAsRead(notificationIds);
    }
  }

  markAsRead(item: NotificationMessageTemplate) {
    return this.notifications.filter(
      (n) => n.notificationStatus === item.notificationStatus
    ).length; // 1 Read, 2 Unread.
  }

  onToggle($event: any) {}

  loadMore(): void {
    this.hasMore = false;
    // write logic for load more.
  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  toggleMenu() {
    this.showNotifications = !this.showNotifications;
  }

  openMenu() {
    this.showNotifications = true;
    this.notificationMenu.nativeElement.removeAttribute('class');
    this.notificationMenu.nativeElement.setAttribute(
      'class',
      'notification-menu py-4 show'
    );
  }

  closeMenu() {
    this.showNotifications = false;
    this.notificationMenu.nativeElement.removeAttribute('class');
    this.notificationMenu.nativeElement.setAttribute(
      'class',
      'notification-menu py-4 hide'
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.fetchTimeInterval);
    clearInterval(this.readAllTimeInterval);
  }
}
