import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleFitService } from 'src/app/services/google-fit.service';
import * as moment from 'moment';
import { IonInfiniteScroll } from '@ionic/angular';

interface CustomError {
  status: boolean;
  message: string;
}

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})

export class HistoricPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  activities: any = [];
  activitiesToShow: any = [];
  newOffset: number;
  offset: number;
  totalLength: number;
  error: CustomError = {
    message: '',
    status: false,
  };
  loading: boolean = false;
  private n = 25;

  constructor(private ggFit: GoogleFitService) { }

  ngOnInit() {
    moment.locale('FR');
    this.error.status=false;
  }

  ionViewWillEnter() {
    this.error.status=false;
    this.activities = [];
    this.activitiesToShow = [];
    this.offset = 0;
    this.newOffset = 0;
    this.totalLength = 0;
    var wait = new Promise((resolve, reject) => this.getStepsInfoFromGgFit(resolve, reject))
    wait
    .then(
      () => { this.loadActivitiesToshow('') }
    )
    .catch(
      err => {
        console.log(err);
      }
    );
  }

  getStepsInfoFromGgFit(resolve, reject) {

    var today = new Date();
    this.loading = true;
    this.error.status = false;

    var req = {
      startTime: today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000, // ~3 mois en arrière
      endTime: today.getTime(),
      duration: 7200000 //=2H //Milliseconds 
    }

    return this.ggFit.getStepsInfo(req)
      .then(
        (data: any) => {
          console.log(data)
          data.bucket
            .filter(
              activity => {
                return activity.dataset[0].point.length > 0
              }
            )
            .map(

              (activity) => {
                console.log(activity);
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
                if (this.totalLength === 1) {
                  resolve()
                }
              }
            )
        }
      )
      .catch(
        err => {
          console.log(err);
          this.error.status = true;
          if (err.status == 401){
            this.error.message = 'Veuillez vous reconnecter !';
          }else if( err.status == 403 ){
            this.error.message = "Vous n'avez fait aucune session de marche durant ces 3 derniers mois !";
          }else{
            this.error.message = "Erreur Inconnu.";
          }
          reject()
        }
      );
  }

  loadActivitiesToshow(event) {

    this.loading = false;
    this.error.status = false;

    this.newOffset = this.totalLength;

    console.log(this.activities);
    console.log('tt: ' + this.totalLength)
    console.log(`offset: ${this.offset}, newOffset: ${this.newOffset}`);

    if (this.newOffset - this.offset > this.n) {
      console.log('1')
      for (let i = this.offset; i < this.offset + this.n; i++) {
        this.activitiesToShow.push(this.activities[i])
      }
      this.offset = this.offset + this.n;
    } else if (this.newOffset - this.offset < this.n && this.newOffset - this.offset > 0) {
      console.log('2')
      for (let i = this.offset; i < this.newOffset ; i++) {
        this.activitiesToShow.push(this.activities[i])
        this.offset = +this.newOffset;
      }
    } else {
      console.log("3")
      this.infiniteScroll.disabled = true;
    }

    if (event != '') {
      event.target.complete();
    }
    console.log(this.activitiesToShow);
  }

}
