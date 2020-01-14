import { Component, OnInit } from '@angular/core';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { GoogleFitService } from 'src/app/services/google-fit.service';
import { LoginService } from 'src/app/services/login.service';
import { UserCloudFuncService } from 'src/app/services/user-cloud-func.service';

@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.page.html',
  styleUrls: ['./start-session.page.scss'],
})
export class StartSessionPage implements OnInit {


  stepsCount = 0;
  stopWatch = '00:00:00';
  intervalId;
  private timerStart: Date;
  private timerEnd: Date;

  constructor(private pedometer: Pedometer, private ref: ChangeDetectorRef, 
    private ggFit : GoogleFitService, private loginService: LoginService,
    private cloudFunction : UserCloudFuncService) {
    console.log(this.pedometer);
  }

  ngOnInit() {  }

  startTimer() {
    this.timerStart = new Date();
    this.intervalId = setInterval(
      () => {
        this.getTimeElapsed(this.timerStart);
      }, 1000)

  }

  stopTimer(){
    this.timerEnd = new Date();
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
        res => { console.log(res); this.sendStepstoGgFit() }
      ).catch(
        err => { console.error(err) }
      );
  }

  sendStepstoGgFit() {
    var data = {
      gmail: this.loginService.loggedUser.gmail,
      startTime: this.timerStart.getTime(),
      endTime: this.timerEnd.getTime(),
      value: this.stepsCount,
    }

    this.cloudFunction.createRecordedActivity(data)
    .then(
      (res)=>{
        console.log(res);
        this.ggFit.postStepInfo(data)
        .then(
          res => console.log(res)
        )
      }
    )
    .catch(
      (err)=>console.log(err)
    );
  }

  getData(){
    this.ggFit.getDataSources()
    .then(
      res => console.log(res)
    )
  }

  deleteDataSource(){
    this.ggFit.deleteAllDataSource();
  }

}
