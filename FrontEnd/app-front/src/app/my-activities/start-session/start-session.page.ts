import { Component, OnInit } from '@angular/core';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { GoogleFitService } from 'src/app/services/google-fit.service';

@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.page.html',
  styleUrls: ['./start-session.page.scss'],
})
export class StartSessionPage implements OnInit {


  stepsCount = 0;
  stopWatch = '00:00:00';
  intervalId;

  constructor(private pedometer: Pedometer, private ref: ChangeDetectorRef, private ggFit : GoogleFitService) {
    console.log(this.pedometer);
  }

  ngOnInit() {  }

  startTimer() {
    var timerStart : any = new Date();
    this.intervalId = setInterval(
      () => {
        this.getTimeElapsed(timerStart);
      }, 1000)

  }

  stopTimer(){
    clearInterval(this.intervalId);
  }

  getTimeElapsed(timerStart: any){
    let timerRuning : any = new Date();
    let timeElapsed = new Date(timerRuning - timerStart);
    timeElapsed.setHours(timeElapsed.getHours()-1);
    this.stopWatch = moment(timeElapsed).format('HH:mm:ss');
  }

  startPedometer() {
    this.startTimer();
    this.pedometer.startPedometerUpdates()
      .subscribe(
        (data) => {
          this.stepsCount = data.numberOfSteps;
          this.ref.detectChanges()
        },

        (err) => {
          console.error(err);
        });
  }

  stopPedometer() {
    this.stopTimer();
    this.pedometer.stopPedometerUpdates()
      .then(
        res => { console.log(res) }
      ).catch(
        err => { console.error(err) }
      );
  }

  sendStepstoGgFit() {
  }


}
