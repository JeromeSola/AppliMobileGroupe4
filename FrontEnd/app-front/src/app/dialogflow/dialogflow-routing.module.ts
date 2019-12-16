import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogflowPage } from './dialogflow.page';

const routes: Routes = [
  {
    path: '',
    component: DialogflowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogflowPageRoutingModule {}
