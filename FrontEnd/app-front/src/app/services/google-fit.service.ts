import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getData(){
    this.http.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources?alt=json&access_token=${this.loginService.loggedUser.access_token}`)
    .subscribe(
      (data: any) => {
        console.log(data)
      },
      error => {
        console.log(error)
  
      });
  }

  getData2(){
    this.http.get(`https://www.googleapis.com/fitness/v1/users/me/sessions?alt=json&access_token=${this.loginService.loggedUser.access_token}`)
    .subscribe(
      (data: any) => {
        console.log(data)
      },
      error => {
        console.log(error)
  
      });
  }
}
