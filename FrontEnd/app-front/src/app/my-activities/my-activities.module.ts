import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyActivitiesPageRoutingModule } from './my-activities-routing.module';

import { MyActivitiesPage } from './my-activities.page';
// import { StartSessionPage } from './start-session/start-session.page';
// import { HistoricPage } from './historic/historic.page';
// import { ProgressionPage } from './progression/progression.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyActivitiesPageRoutingModule
  ],
  declarations: [
    MyActivitiesPage,
    // StartSessionPage,
    // HistoricPage,
    // ProgressionPage
  ]
})
export class MyActivitiesPageModule {}
