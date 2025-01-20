import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { PhaseConfigComponent } from './phase-config.component';
import { EditPhaseConfigComponent } from './edit-phase-config/edit-phase-config.component';

const routes: Routes = [
  {
    path: '',
    component: PhaseConfigComponent,
  },
];

@NgModule({
  declarations: [PhaseConfigComponent, EditPhaseConfigComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhaseConfigModule {}
