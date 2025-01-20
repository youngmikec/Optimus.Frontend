import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country-main',
  templateUrl: './country-main.component.html',
  styleUrls: ['./country-main.component.scss'],
})
export class CountryMainComponent {
  BreadcrumbSub!: Subscription;
  constructor() {
    // this.BreadcrumbSub = this.route.data.subscribe((data) => {
    //   this.route.snapshot.data['breadcrumb'] =
    //     this.route.snapshot.paramMap.get('name');
    // });
  }
}
