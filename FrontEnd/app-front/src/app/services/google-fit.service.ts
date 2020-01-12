import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getData() {
    this.http.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources?alt=json&access_token=${this.loginService.loggedUser.access_token}`)
      .subscribe(
        (data: any) => {
          console.log(data)
        },
        error => {
          console.log(error)

        });
  }

  getStepsInfo(req: any) {

    let data = {
      aggregateBy: [
        {
          dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }
      ],
      endTimeMillis: req.endTime,
      startTimeMillis: req.startTime,
      bucketByTime: {
        durationMillis: req.duration,
      }

    }

    return this.http.post(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate?alt=json&access_token=${this.loginService.loggedUser.access_token}`, data).toPromise()
  }

  // {
  //   "aggregateBy": [
  //     {
  //       "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
  //     }
  //   ],
  //   "endTimeMillis": 1578678205703,
  //   "startTimeMillis": 1574678205703,
  //   "bucketByTime": {
  //     "durationMillis": 84000000
  //   }
  // }
}