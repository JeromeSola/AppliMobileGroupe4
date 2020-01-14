import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getDataSources() {
    return this.http.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources?alt=json&access_token=${this.loginService.loggedUser.access_token}`).toPromise()
  }

  deleteAllDataSource() {
    this.getDataSources().then(
      (res: any) => {
        console.log(res);
        if (this.loginService.loggedUser.gmail === "jeantestg4@gmail.com") {
          console.log("ok");
          return
        } else {
          for (let data of res.dataSource) {
            console.log(data.dataStreamId);
            this.http.delete(`https://www.googleapis.com/fitness/v1/users/me/dataSources/${data.dataStreamId}?alt=json&access_token=${this.loginService.loggedUser.access_token}`).toPromise()
            .then(
              res => console.log(res)
            )
          }
        }

      }
    )
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

  postStepInfo(req: any) {
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

    // {
    //   "application": {
    //     "name": "coachman.steps.count"
    //   },
    //   "dataType": {
    //     "field": [
    //       {
    //         "format": "integer",
    //         "name": "steps"
    //       }
    //     ],
    //     "name": "com.google.step_count.delta"
    //   },
    //   "device": {
    //     "manufacturer": "phone",
    //     "model": "phone",
    //     "type": "unknown",
    //     "uid": "phone",
    //     "version": "phone"
    //   },
    //   "type": "derived"
    // }
  }
}
