import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountRequestComponent } from './discount-request.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountRequestRoutingModule {}
