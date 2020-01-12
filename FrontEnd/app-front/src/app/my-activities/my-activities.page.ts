import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.page.html',
  styleUrls: ['./my-activities.page.scss'],
})
export class MyActivitiesPage implements OnInit {

  public tab : string = 'historic'

  constructor() {
  
  }

  ngOnInit() {
  }

  go(page : any){
    this.tab = page
  }

}
