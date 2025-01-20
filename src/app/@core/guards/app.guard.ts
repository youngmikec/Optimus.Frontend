import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from '../stores/app.reducer';
import * as authSelectors from '../stores/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AppGuard
  implements CanActivate, CanActivateChild, CanLoad, OnDestroy
{
  permissions!: string[];
  userPermissionsSub: Subscription;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {
    const userPermissions = this.store.pipe(
      select(authSelectors.getUserPermissions)
    );

    this.userPermissionsSub = userPermissions.subscribe((permissions) => {
      if (permissions) {
        this.permissions = [...permissions];
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.checkChildRoutes(childRoute, state)) {
      return true;
    } else {
      this.router.navigate(['/unauthorized-page']);
      return false;
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }

  checkChildRoutes(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    /********************* Dashbord ***********************/
    if (
      state.url === '/app/dashboard' &&
      !this.permissions?.includes('View Dashboard')
    ) {
      // Not authorized
      return false;
    }

    /********************* Quote Calculator ***********************/

    if (
      state.url === '/app/calculator' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    /********************* Applicants ***********************/

    if (
      state.url === '/app/applicants' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    /********************* Admin Settings ***********************/

    if (
      state.url === '/app/admin-settings' &&
      !this.permissions?.includes(
        'View Organization' ||
          !this.permissions?.includes('View Role') ||
          !this.permissions?.includes('View Features') ||
          !this.permissions?.includes('View Currency') ||
          !this.permissions?.includes('View User') ||
          !this.permissions?.includes('View Country')
      )
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/org-settings' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/roles-permission' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url.includes('/app/admin-settings/roles-permission/edit') &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/roles-permission/create' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/features' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/currency-config' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/user-management' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/user-management/create' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    if (
      state.url === '/app/admin-settings/country-setup' &&
      !this.permissions?.includes(route.data['permission'])
    ) {
      return false;
    }

    return true;
  }

  ngOnDestroy() {
    if (this.userPermissionsSub) {
      this.userPermissionsSub.unsubscribe();
    }
  }
}
