import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarBreadcrumbServiceService } from 'src/app/@core/services/navbar-breadcrumb.service';
@Component({
  selector: 'app-navbar-breadcrumb',
  templateUrl: './navbar-breadcrumb.component.html',
  styleUrls: ['./navbar-breadcrumb.component.scss'],
})
export class NavbarBreadcrumbComponent implements OnInit, OnDestroy {
  breadCrumbSub!: Subscription;
  breadcrumbLoadedData!: any;

  constructor(
    private readonly navbarBreadcrumbServiceService: NavbarBreadcrumbServiceService
  ) {}

  ngOnInit() {
    this.breadCrumbSub =
      this.navbarBreadcrumbServiceService.breadcrumbs$.subscribe((resData) => {
        this.breadcrumbLoadedData = [
          ...new Map(resData.map((m) => [m?.breadcrumb, m])).values(), //Remove duplicates
        ];

        this.breadcrumbLoadedData = this.breadcrumbLoadedData.filter(
          (resData: any) => resData?.breadcrumb !== 'Webapp'
        );
      });
  }

  goBack() {
    history.back();
  }

  ngOnDestroy(): void {
    if (this.breadCrumbSub) {
      this.breadCrumbSub.unsubscribe();
    }
  }
}
