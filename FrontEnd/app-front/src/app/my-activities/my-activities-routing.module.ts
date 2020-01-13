import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyActivitiesPage } from './my-activities.page';

const routes: Routes = [
  {
    path: '',
    component: MyActivitiesPage,
    children: [
      {
        path: 'start-session',
        children: [
          {
            path: '',
            loadChildren: () => import('./start-session/start-session.module').then( m => m.StartSessionPageModule)
          }
        ]
      },
      {
        path: 'historic',
        children: [
          {
            path: '',
            loadChildren: () => import('./historic/historic.module').then( m => m.HistoricPageModule)
          }

        ]

      },
      {
        path: 'progression',
        children: [
          {
            path: '',
            loadChildren: () => import('./progression/progression.module').then( m => m.ProgressionPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/my-activities/start-session',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/my-activities/start-session',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyActivitiesPageRoutingModule { }
