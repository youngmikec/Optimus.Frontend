import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnathorizedPageComponent } from './@components/unathorized-page/unathorized-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },

  {
    path: 'site',
    loadChildren: () =>
      import('./@components/website/website.module').then(
        (m) => m.WebsiteModule
      ),
  },

  {
    path: 'app',
    data: { breadcrumb: 'Webapp' },
    loadChildren: () =>
      import('./@components/webapp/webapp.module').then((m) => m.WebappModule),
  },

  {
    path: 'unauthorized-page',
    data: { breadcrumb: 'Webapp' },
    component: UnathorizedPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
