import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';

const modules = [TableModule, ButtonModule, SplitButtonModule, SpeedDialModule];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class PrimeNgModule {}
