import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleFitService } from 'src/app/services/google-fit.service';
import * as moment from 'moment';
import { IonInfiniteScroll } from '@ionic/angular';



@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  activities : any = [];
  activitiesToShow : any = [];
  newOffset: number;
  offset: number;
  totalLength: number;
  private n = 25;

  constructor(private ggFit: GoogleFitService) { }

  ngOnInit() {
    moment.locale('FR');
    this.offset = 0;
    this.newOffset = 0;
    this.totalLength = 0;
    var wait = new Promise((resolve, reject) => this.getStepsInfoFromGgFit(resolve, reject))
    wait.then(
      ()=> {console.log('lol');this.loadActivitiesToshow('')}
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStepsInfoFromGgFit(resolve, reject) {
    var req = {
      startTime: 1574636400000,
      endTime: 1578678205703,
      duration: 7200000 //=2H // 86400000 //=1J  //Milliseconds 
    }

   return this.ggFit.getStepsInfo(req)
      .then(
        (data: any) => {
          data.bucket
            .filter(
              activity => {
                return activity.dataset[0].point.length > 0
              }
            )
            .map(

              ( activity ) => {
                var startTime: any = new Date(Math.round(+activity.dataset[0].point[0].startTimeNanos / 1000000));
                var endTime: any = new Date(Math.round(+activity.dataset[0].point[0].endTimeNanos / 1000000));
                let timeElapsed = new Date(endTime - startTime);
                timeElapsed.setHours(timeElapsed.getHours() - 1);

                var duration = moment(timeElapsed).format('HH:mm:ss');

                this.activities.push({
                  date: moment(startTime).format("dddd Do MMMM YYYY"),
                  period: `De ${moment(startTime).format("HH:mm:ss")} à ${moment(endTime).format("HH:mm:ss")}`,
                  duration: duration,
                  stepsNumber: +activity.dataset[0].point[0].value[0].intVal,
                })

                this.totalLength++;
                if(this.totalLength === 1 ){
                  console.log(this.totalLength)
                  resolve()
                }
              }
            )
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  loadActivitiesToshow(event) {
    this.newOffset = this.totalLength;
    console.log(`offset: ${this.offset}, newOffset: ${this.newOffset}`);

    if (this.newOffset - this.offset > this.n) {
      console.log('1')
      for (let i = this.offset; i < this.offset + this.n; i++) {
        this.activitiesToShow.push(this.activities[i])
      }
      this.offset = +this.n;
    } else if( this.newOffset - this.offset < this.n && this.newOffset - this.offset > 0){
      console.log('2')
      for (let i = this.offset; i < this.newOffset; i++) {
        this.activitiesToShow.push(this.activities[i])
      }
    } else {
      console.log("3")
      this.infiniteScroll.disabled = true;
    }

    if (event != '') {
      event.target.complete();
    }
    console.log(this.activitiesToShow)

  }

}
