/* eslint-disable prettier/prettier */
import { NgModule } from '@angular/core';

import { DocumentConfigurationComponent } from './document-configuration.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { DocumentQuestionsComponent } from './document-questions/document-questions.component';


const routes: Routes = [
  {
    path: '',
    component: DocumentConfigurationComponent,
  },
  {
    path: 'document-questions',
    component: DocumentQuestionsComponent,
  },
];

@NgModule({
  declarations: [DocumentConfigurationComponent, DocumentQuestionsComponent],
  imports: [ SharedModule, RouterModule.forChild(routes)],
})
export class DocumentConfigurationModule {}
