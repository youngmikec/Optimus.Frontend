import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
// import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as userSelections from 'src/app/@core/stores/users/users.selectors';
import { SidebarService } from 'src/app/@core/services/sidebar.service';
// import { NotificationService } from 'src/app/@core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userLogin: any;
  user: any;
  userSub!: Subscription;
  dialogRef: any;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private sidebarService: SidebarService // private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar.next(true);
  }

  getUser() {
    this.store.pipe(select(authSelections.getUser)).subscribe((res) => {
      if (res !== null) this.userLogin = res;
    });

    this.store.dispatch(
      UserActions.GetUserById({
        payload: {
          userId: this.userLogin?.UserId,
          loggedInUser: this.userLogin?.loggedInUser,
        },
      })
    );

    this.userSub = this.store
      .pipe(select(userSelections.getUserById))
      .subscribe((res) => {
        if (res !== null) {
          this.user = res;
        }
      });
  }
}
