import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromApp from './@core/stores/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgIdleModule } from '@ng-idle/core';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from 'src/app/@core/styles/material/material.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { PdfViewerModule } from 'ng2-pdf-viewer';

import { environment } from 'src/environments/environment';
//interceptors
import { AppInterceptorService } from './@core/interceptors/app.interceptor.service';
import { RetryInterceptorService } from './@core/interceptors/retry.interceptor.service';

//components
import { AppComponent } from './app.component';
import { UnathorizedPageComponent } from './@components/unathorized-page/unathorized-page.component';

//Effects
import { AuthEffects } from './@core/stores/auth/auth.effects';
import { FeaturesEffects } from './@core/stores/features/features.effects';
import { DocumentConfigurationEffects } from './@core/stores/documentConfiguration/documentConfiguration.effects';
import { RolesEffects } from './@core/stores/roles/roles.effects';
import { GeneralEffects } from './@core/stores/general/general.effects';
import { CountriesEffects } from './@core/stores/countries/countries.effects';
import { FamilyMembersEffects } from './@core/stores/familyMembers/familyMembers.effects';
import { FamilyMemberTypeSettingsEffects } from './@core/stores/familyMemberTypeSettings/familyMemberTypeSettings.effects';
import { CurrencyEffects } from './@core/stores/currency/currency.effects';
import { UsersEffects } from './@core/stores/users/users.effects';
import { DepartmentsEffects } from './@core/stores/department/departments.effects';
import { MigrationRoutesEffects } from './@core/stores/migrationRoutes/migrationRoutes.effects';
import { ProductsEffects } from './@core/stores/product/product.effects';
import { ProductCategoryEffects } from './@core/stores/productCategory/productCategory.effects';
import { RouteQuestionEffects } from './@core/stores/routeQuestions/routeQuestions.effects';
import { RouteFeeEffects } from './@core/stores/routeFees/routeFees.effects';
import { InvoiceCurrenciesEffects } from './@core/stores/invoiceCurrencies/invoiceCurrencies.effects';
import { ApplicantsEffects } from './@core/stores/applicants/applicants.effects';
import { PaymentPlanEffects } from './@core/stores/paymentPlan/paymentPlan.effects';
import { DiscountEffects } from './@core/stores/discount/discount.effects';
import { PartnerEffects } from './@core/stores/partners/partners.effects';
import { DashboardEffects } from './@core/stores/dashboard/dashboard.effects';
import { ApplicationQuotesEffects } from './@core/stores/applicationQuotes/applicationQuotes.effects';
import { ApplicantsDashboardEffects } from './@core/stores/applicantsDashboard/applicantDashboard.effects';
import { NotesEffects } from './@core/stores/notes/note.effects';
import { InvoiceItemsEffects } from './@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.effects';
import { CommentsEffects } from './@core/stores/comments/comments.effects';
import { SaleServiceEffects } from './@core/stores/sale-service/sale-service.effects';
import { DocumentCollectionEffects } from './@core/stores/document-collection/document-collection.effects';
import { InvoiceEffects } from './@core/stores/invoices/invoices.effects';
import { PhaseEffects } from './@core/stores/phases/phase.effects';
import { DocumentProcessingEffects } from './@core/stores/document-processing/document-processing.effects';
import { ApplicationPhaseEffects } from './@core/stores/applicationPhase/application-phase.effects';
import { SignatureEffects } from './@core/stores/signature/signature.effects';
import { QuoteCalculatorEffects } from './@core/stores/quoteCalculator/quoteCalculator.effects';
import { DocumentSupportEffects } from './@core/stores/document-support/document-support.effects';
import { DocumentAuditEffects } from './@core/stores/document-audit/document-audit.effects';
import { TableViewsEffects } from './@core/stores/table-view/table-view.effects';
import { NotificationEffects } from './@core/stores/notifications/notifications.effects';
import { AuthModule } from './@auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    UnathorizedPageComponent
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgIdleModule.forRoot(),
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([
      AuthEffects,
      FeaturesEffects,
      DocumentConfigurationEffects,
      RolesEffects,
      GeneralEffects,
      CountriesEffects,
      DiscountEffects,
      FamilyMembersEffects,
      FamilyMemberTypeSettingsEffects,
      CurrencyEffects,
      UsersEffects,
      PartnerEffects,
      DepartmentsEffects,
      MigrationRoutesEffects,
      ProductsEffects,
      ProductCategoryEffects,
      RouteQuestionEffects,
      RouteFeeEffects,
      InvoiceCurrenciesEffects,
      ApplicantsEffects,
      DashboardEffects,
      PaymentPlanEffects,
      ApplicationQuotesEffects,
      ApplicantsDashboardEffects,
      NotesEffects,
      InvoiceItemsEffects,
      CommentsEffects,
      SaleServiceEffects,
      DocumentCollectionEffects,
      InvoiceEffects,
      PhaseEffects,
      DocumentProcessingEffects,
      ApplicationPhaseEffects,
      QuoteCalculatorEffects,
      SignatureEffects,
      DocumentSupportEffects,
      DocumentAuditEffects,
      TableViewsEffects,
      NotificationEffects,
    ]),
    environment.production
    ? []
    : StoreDevtoolsModule.instrument({
        logOnly: environment.production,
      }),
    // PdfViewerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptorService,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
