import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as userSelections from 'src/app/@core/stores/users/users.selectors';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';
import { Subscription } from 'rxjs';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { PermissionService } from 'src/app/@core/services/permission.service';

@Component({
  selector: 'app-org-settings',
  templateUrl: './org-settings.component.html',
  styleUrls: ['./org-settings.component.scss'],
})
export class OrgSettingsComponent implements OnInit, OnDestroy {
  user: any;
  userSub!: Subscription;
  loggedInUser: any;
  allDepartmentsCount: any;
  getAllDepartmentsSub!: Subscription;
  allDivisionsCount: any;
  getAllDivisionsSub!: Subscription;
  allUnitsCount: any;
  getAllUnitsSub!: Subscription;
  allLocationCount: any;
  getAllLocationSub!: Subscription;
  allJobsCount: any;
  getAllJobsSub!: Subscription;

  canViewDivision: boolean = false;
  canViewDepartment: boolean = false;
  canViewUnit: boolean = false;
  canViewCompanyProfile: boolean = false;
  canViewJobTitle: boolean = true;

  constructor(
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.canViewDivision =
        this.permissionService.getPermissionStatuses('Division')[0];
      this.canViewDepartment =
        this.permissionService.getPermissionStatuses('Department')[0];
      this.canViewUnit =
        this.permissionService.getPermissionStatuses('Unit')[0];
      this.canViewCompanyProfile =
        this.permissionService.getPermissionStatuses('Company Profile')[0];
      // this.canViewJobTitle =
      //   this.permissionService.getPermissionStatuses('Job Title')[0];
    });

    this.getUser();

    this.getAllDepartments();

    this.getAllDivisions();

    this.getAllUnits();

    this.getAllLocation();

    this.getAllJobTitle();
  }

  getUser() {
    this.store.pipe(select(authSelections.getUser)).subscribe((res) => {
      if (res !== null) {
        this.loggedInUser = res;
        this.store.dispatch(
          UserActions.GetUserById({
            payload: {
              userId: this.loggedInUser?.UserId,
              loggedInUser: this.loggedInUser?.UserId,
            },
          })
        );
      }
    });

    this.userSub = this.store
      .pipe(select(userSelections.getUserById))
      .subscribe((res) => {
        if (res !== null) {
          this.user = res;
        }
      });
  }

  getAllDepartments(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetAllDepartments({
        payload: {
          skip,
          take,
        },
      })
    );

    this.getAllDepartmentsSub = this.store
      .pipe(select(departmentsSelectors.getAllDepartments))
      .subscribe((resData: any) => {
        if (resData) {
          this.allDepartmentsCount = resData.count;
        }
      });
  }

  getAllDivisions(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DepartmentsActions.GetAllDivisions({
        payload: {
          skip,
          take,
        },
      })
    );

    this.getAllDivisionsSub = this.store
      .pipe(select(departmentsSelectors.getAllDivisions))
      .subscribe((resData: any) => {
        if (resData) {
          this.allDivisionsCount = resData.count;
        }
      });
  }

  getAllUnits(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      DepartmentsActions.GetAllUnits({
        payload: {
          skip,
          take,
        },
      })
    );

    this.getAllUnitsSub = this.store
      .pipe(select(departmentsSelectors.getAllUnits))
      .subscribe((resData: any) => {
        if (resData) {
          this.allUnitsCount = resData.count;
        }
      });
  }

  getAllLocation(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      DepartmentsActions.GetAllBranches({
        payload: {
          skip,
          take,
        },
      })
    );

    this.getAllLocationSub = this.store
      .pipe(select(departmentsSelectors.getAllBranches))
      .subscribe((resData: any) => {
        if (resData) {
          this.allLocationCount = resData.count;
        }
      });
  }

  getAllJobTitle(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      DepartmentsActions.GetJobTitle({
        payload: {
          skip,
          take,
        },
      })
    );

    this.getAllJobsSub = this.store
      .pipe(select(departmentsSelectors.getAllJobTitle))
      .subscribe((resData: any) => {
        if (resData) this.allJobsCount = resData.totalCount;
      });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }

    if (this.getAllDepartmentsSub) {
      this.getAllDepartmentsSub.unsubscribe();
    }

    if (this.getAllDivisionsSub) {
      this.getAllDivisionsSub.unsubscribe();
    }

    if (this.getAllUnitsSub) {
      this.getAllUnitsSub.unsubscribe();
    }

    if (this.getAllLocationSub) {
      this.getAllUnitsSub.unsubscribe();
    }

    if (this.getAllJobsSub) {
      this.getAllJobsSub.unsubscribe();
    }
  }
}
