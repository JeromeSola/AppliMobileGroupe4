import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

/**
 * When adding a new component :
 *    - Create the component with "ionic g component components/myComponent --export"
 *    - Import the component in this module (import { TestComponent } from './test/test.component';)
 *    - Add the component in the declarations and in the exports in this module.
 *    - Import the component in the app module.
 *    - Add the component in the entry components in the app module.
 */

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
  ]
})
export class ComponentsModule { }
