import { Component, OnInit } from '@angular/core';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { GoogleFitService } from 'src/app/services/google-fit.service';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.page.html',
  styleUrls: ['./my-activities.page.scss'],
})
export class MyActivitiesPage implements OnInit {

  stepsCount = 0;
  stopWatch = '00:00:00';
  intervalId;

  constructor(private pedometer: Pedometer, private ref: ChangeDetectorRef, private ggFit : GoogleFitService) {
    console.log(this.pedometer);
  }

  ngOnInit() {
    this.pedometer.isDistanceAvailable().then(res => console.log('Distance Available')).catch(err => console.error('Distance not Available'));
    this.pedometer.isStepCountingAvailable().then(res => console.log('step counting Available')).catch(err => console.error('step counting not Available'));
  }

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

  getStepsInfoFromSession() {
    this.ggFit.getData2();
  }
}
