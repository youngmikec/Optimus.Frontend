import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Routes, RouterModule } from '@angular/router';
import { CountryDashboardComponent } from '../country-dashboard/country-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InvoiceCurrenciesComponent } from './invoice-currencies/invoice-currencies.component';
import { FamilyMembersComponent } from './family-members/family-members.component';
import { PaymentPlanComponent } from './payment-plan/payment-plan.component';
import { CreateInvoiceComponent } from './invoice-currencies/create-invoice/create-invoice.component';
import { CreateFamilyMemberComponent } from './family-members/create-family-member/create-family-member.component';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { CreateProductCategoryComponent } from './product-category/create-product-category/create-product-category.component';
import { CreatePaymentPlanComponent } from './payment-plan/create-payment-plan/create-payment-plan.component';
import { FamilyMemberTypeSettingComponent } from './family-member-type-setting/family-member-type-setting.component';
import { CreateFamilyMemberTypeSettingsComponent } from './family-member-type-setting/create-family-member-type-settings/create-family-member-type-settings.component';
import { DiscountComponent } from './discount/discount.component';
import { CreateDiscountComponent } from './discount/create-discount/create-discount.component';

const routes: Routes = [
  {
    path: '',
    component: CountryDashboardComponent,
  },
  {
    path: '',
    children: [
      {
        path: 'invoiceCurrency',
        data: { breadcrumb: 'Invoice Currencies' },
        component: InvoiceCurrenciesComponent,
      },

      {
        path: 'familyMembers',
        data: { breadcrumb: 'Family Members' },
        component: FamilyMembersComponent,
      },

      {
        path: 'family-members-type-settings',
        data: { breadcrumb: 'Family Members Type Settings' },
        component: FamilyMemberTypeSettingComponent,
      },

      {
        path: 'migrationRoutes',
        data: { breadcrumb: 'Migration Routes' },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/admin-settings/country-setup/country-dashboard/migration-routes/migration-route.module'
          ).then((m) => m.MigrationRouteModule),
      },

      {
        path: 'paymentPlans',
        data: { breadcrumb: 'Payment Plan' },
        component: PaymentPlanComponent,
      },
      {
        path: 'discount',
        data: { breadcrumb: 'Discount' },
        component: DiscountComponent,
      },

      {
        path: 'product',
        data: { breadcrumb: 'Product' },
        component: ProductComponent,
      },

      {
        path: 'productCategory',
        data: { breadcrumb: 'Product Category Configuration' },
        component: ProductCategoryComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    CountryDashboardComponent,
    InvoiceCurrenciesComponent,
    FamilyMembersComponent,
    PaymentPlanComponent,
    CreateInvoiceComponent,
    CreateFamilyMemberComponent,
    DiscountComponent,
    CreateDiscountComponent,
    ProductComponent,
    CreateProductComponent,
    ProductCategoryComponent,
    CreateProductCategoryComponent,
    CreatePaymentPlanComponent,
    FamilyMemberTypeSettingComponent,
    CreateFamilyMemberTypeSettingsComponent,
  ],
  imports: [
    SharedModule,
    DragDropModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
  ],
})
export class CountryDashboardModule {}
