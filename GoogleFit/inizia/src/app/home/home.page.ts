import { Component } from '@angular/core';
import { Health } from '@ionic-native/health/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private health: Health, private pedometer: Pedometer, public stepsCount: number) {
    stepsCount = 0;
    console.log(this.pedometer);
    this.pedometer.isDistanceAvailable().then(res => console.log('Distance Available')).catch(err => console.error('Distance not Available'))
    this.pedometer.isStepCountingAvailable().then(res => console.log('step counting Available')).catch(err => console.error('step counting not Available'))
  }

  startPedometer() {
    this.pedometer.startPedometerUpdates()
      .subscribe(
        (data) => {
          console.log(data);
          this.stepsCount = data.numberOfSteps;
        },

        (err) => {
          console.error(err);
        });
  }

  stopPedometer() {
    this.pedometer.stopPedometerUpdates()
      .then(
        res => { console.log(res) }
      ).catch(
        err => { console.error(err) }
      );
  }

  sendStepstoGgFit() {
    this.health.isAvailable()
      .then(

        (available: boolean) => {
          console.log('Available', available);
          this.health.requestAuthorization([
            'distance', 'nutrition',  //read and write permissions
            {
              read: ['steps', 'weight'],       //read only permission
              write: ['height', 'weight', 'steps']  //write only permission
            }
          ])
            .then(

              (res) => {
                console.log('res', res);
                this.health.store({
                  startDate: new Date(new Date().getTime() - 3 * 60 * 1000),
                  // three minutes ago
                  endDate: new Date(), // now
                  dataType: 'steps',
                  value: '180',
                  sourceName: 'inizia',
                  sourceBundleId: 'io.ionic.starter'
                })
                  .then(

                    data => {
                      console.log(data);
                    })
              }
            )
        })
      .catch(e => console.log(e));
  }

  getStepsInfoFromSession() {
    this.health.isAvailable()
      .then(

        (available: boolean) => {
          console.log('Available', available);
          this.health.requestAuthorization([
            'distance', 'nutrition',  //read and write permissions
            {
              read: ['steps', 'weight'],       //read only permission
              write: ['height', 'weight', 'steps']  //write only permission
            }
          ])
            .then(

              (res) => {
                this.health.query({
                  startDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
                  // ten days ago
                  endDate: new Date(), // now
                  dataType: 'steps',
                  limit: 1000
                }).then(

                  data => {
                    console.log(JSON.stringify(data));
                  })
              })
        })
  }

}
