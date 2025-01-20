import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class SalesServiceBreadcrumbResolver implements Resolve<any> {
  constructor() {}
  resolve(route: ActivatedRouteSnapshot) {
    // fetch breadcrumb data based on the current route
    const breadcrumb = route.params['id'];
    return breadcrumb;
  }
}
