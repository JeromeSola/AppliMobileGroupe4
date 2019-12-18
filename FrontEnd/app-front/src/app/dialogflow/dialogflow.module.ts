import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DialogflowPageRoutingModule } from './dialogflow-routing.module';
import { DialogflowPage } from './dialogflow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DialogflowPageRoutingModule
  ],
  declarations: [DialogflowPage]
})
export class DialogflowPageModule {}
