import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebappComponent } from './webapp.component';
import { WebappRoutingModule } from './webapp-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarBreadcrumbComponent } from './navbar/navbar-breadcrumb/navbar-breadcrumb.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';

@NgModule({
  declarations: [
    WebappComponent,
    NavbarComponent,
    SidebarComponent,
    NavbarBreadcrumbComponent,
  ],
  imports: [CommonModule, WebappRoutingModule, SharedModule],
})
export class WebappModule {}
