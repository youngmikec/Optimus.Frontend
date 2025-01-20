import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
// import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private currentUserPermissionSubject!: BehaviorSubject<string[]>;
  public currentUserPermission: Observable<string[]>;

  constructor(private router: Router) {
    this.currentUserPermissionSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('currentUserPermission') || '[]')
    );
    this.currentUserPermission =
      this.currentUserPermissionSubject.asObservable();
  }

  setUserPermissions(permissions: string[]) {
    localStorage.setItem('currentUserPermission', JSON.stringify(permissions));
    this.currentUserPermissionSubject.next(permissions);
  }

  public get currentUserPermissionValue(): Observable<any> {
    return this.currentUserPermissionSubject;
  }

  // VALUES OF THIS ARRAY IS FOR VIEW, CREATE, EDIT AND ACTIVATE OR DEACTIVATE RESPECTIVELY
  public getPermissionStatuses(moduleName: string): boolean[] {
    let permissions = ['View', 'Create', 'Edit', 'Activate/ Deactivate'];
    let foundPermissions = 0;
    let permissionStatuses: boolean[] = [];
    function breakLoop() {
      return;
    }

    permissions = permissions.map(
      (permission) => `${permission} ${moduleName}`
    );

    permissionStatuses = [];

    permissions.forEach((item: string) => {
      if (this.currentUserPermissionSubject.value.includes(item)) {
        permissionStatuses.push(true);
        foundPermissions++;

        if (foundPermissions >= 4) {
          breakLoop();
        }
      } else {
        permissionStatuses.push(false);
      }
    });
    return permissionStatuses;
  }

  public hasPermission(userPermission: string | string[]): boolean {
    if (!Array.isArray(userPermission)) userPermission = [userPermission];
    return userPermission.some((permission: string) =>
      this.currentUserPermissionSubject.value.includes(permission)
    );
  }

  public routeToUnauthorizedPage() {
    // return this.location.back();/
    return this.router.navigate(['/unauthorized-page']);
  }

  public routeToSpecifiedPath(path: string) {
    // return this.location.back();/
    return this.router.navigate([path]);
  }
}
