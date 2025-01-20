import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class BreadcrumbResolver implements Resolve<any> {
  constructor() {}
  resolve(route: ActivatedRouteSnapshot) {
    // fetch migration name breadcrumb data based on the current route
    const breadcrumb = route.params['routeName'];
    return breadcrumb;
  }
}
