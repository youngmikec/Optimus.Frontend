import { NgModule } from "@angular/core";
import { ClientServiceRoutes } from "./client-service.routing";
import { ClientServiceComponent } from "./client-service.component";
import { SharedModule } from "src/app/@core/shared/shared.module";
import { AllSalesComponent } from './client-service-list/all-sales/all-sales.component';

@NgModule({
    imports: [ClientServiceRoutes, SharedModule],
    declarations: [
        ClientServiceComponent, 
        AllSalesComponent, 
    ]
})
export class ClientServiceModule {}