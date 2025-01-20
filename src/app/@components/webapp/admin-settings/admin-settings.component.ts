import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as userSelectors from 'src/app/@core/stores/users/users.selectors';

import { Subscription } from 'rxjs';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { PermissionService } from 'src/app/@core/services/permission.service';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  user: any;
  userSub!: Subscription;
  loggedInUser: any;
  getAllUserSub!: Subscription;
  logoPreview: any;

  canViewOrgSettings: boolean = false;
  canViewRoles: boolean = false;
  canViewFeature: boolean = false;
  canViewCurrency: boolean = false;
  canViewUserMgmt: boolean = false;
  canViewCountry: boolean = false;
  canViewDocument: boolean = false;
  canViewPartners: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.canViewRoles =
        this.permissionService.getPermissionStatuses('Role')[0];
      this.canViewFeature =
        this.permissionService.getPermissionStatuses('Features')[0];
      this.canViewCurrency =
        this.permissionService.getPermissionStatuses('Currency')[0];
      this.canViewUserMgmt =
        this.permissionService.getPermissionStatuses('User')[0];
      this.canViewCountry =
        this.permissionService.getPermissionStatuses('Country')[0];
      this.canViewDocument =
        this.permissionService.getPermissionStatuses('Country')[0];
      this.canViewPartners =
        this.permissionService.getPermissionStatuses('Partner')[0];

      if (
        this.permissionService.getPermissionStatuses('Division')[0] === true ||
        this.permissionService.getPermissionStatuses('Department')[0] ===
          true ||
        this.permissionService.getPermissionStatuses('Unit')[0] === true ||
        this.permissionService.getPermissionStatuses('Company Profile')[0] ===
          true
      ) {
        this.canViewOrgSettings = true;
      }
    });

    this.getUser();
  }

  getUser() {
    this.store.pipe(select(authSelections.getUser)).subscribe((res) => {
      if (res !== null) this.loggedInUser = res;
    });

    this.store.dispatch(
      UserActions.GetUserById({
        payload: {
          userId: this.loggedInUser?.UserId,
          loggedInUser: this.loggedInUser?.UserId,
        },
      })
    );

    this.userSub = this.store
      .pipe(select(userSelectors.getUserById))
      .subscribe((res) => {
        if (res !== null) {
          this.user = res;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }

    if (this.getAllUserSub) {
      this.getAllUserSub.unsubscribe();
    }
  }
}
