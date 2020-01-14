import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getDataSources() {
    return this.http.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources?alt=json&access_token=${this.loginService.loggedUser.access_token}&dataTypeName=com.google.step_count.delta`)
      .toPromise()
      .then(
         (res: any) => {
          console.log(res)
          let needToCreateDatasource: boolean = false;

          if (res.dataSource.length > 0) {
            for (let data of res.dataSource) {
              if (data.application.name === "coachman.steps.count") {
                return data.dataStreamId;
              } else {
                console.log("heuu");
                needToCreateDatasource = true;
                break;
              }
            }
          } else {
            console.log("hooo")
            needToCreateDatasource = true;
          }

          if(needToCreateDatasource == true){
            return this.createDataSource()
            .then(
              (res) => { console.log(res); return this.getDataSources() },
              (err) => { console.log(err); throw new Error("Error in createDataSource")}
            );
          }

        }
      )
      .catch(
        err => console.error(err)
      )
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

  async postStepInfo(req: any) {

    var dataSourceId: string = await this.getDataSources();
    console.log(dataSourceId);
    let timesInNs = {
      startTime: req.startTime * 1000000,
      endTime: req.endTime * 1000000,
    }

    let data = {
      dataSourceId: dataSourceId,
      maxEndTimeNs: timesInNs.endTime,
      minStartTimeNs: timesInNs.startTime,
      point: [
        {
          dataTypeName: "com.google.step_count.delta",
          endTimeNanos: timesInNs.endTime,
          startTimeNanos: timesInNs.startTime,
          value: [
            {
              intVal: req.value
            }
          ]
        }
      ]
    }

    return this.http.patch(`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${req.startTime}-${req.endTime}?alt=json&access_token=${this.loginService.loggedUser.access_token}`, data).toPromise()

  }

  createDataSource() {
    let data = {
      application: {
        name: "coachman.steps.count"
      },
      dataType: {
        field: [
          {
            format: "integer",
            name: "steps"
          }
        ],
        name: "com.google.step_count.delta"
      },
      device: {
        manufacturer: "Jean",
        model: "GLRT",
        type: "unknown",
        uid: "unknown",
        version: "v1"
      },
      type: "derived"
    }
    return this.http.post(`https://www.googleapis.com/fitness/v1/users/me/dataSources?alt=json&access_token=${this.loginService.loggedUser.access_token}`, data).toPromise()
  }


}
