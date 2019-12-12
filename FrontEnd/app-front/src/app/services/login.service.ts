import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { googleId } from '../../../../../APIKeys/googleId'

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedUser: string;

  constructor(private http: HttpClient,
    private platform: Platform) {
    this.loggedUser = null;
  }

  public isLoggedIn() {
    return (this.loggedUser != null);
  }

  public login() {
    this.platform.ready()
      .then(this.googleLogin)
      .then(success => {
        console.log(success)
        this.http.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${success.access_token}`)
        .subscribe((data:any) => {
          console.log(data);
          this.http.get(`https://us-central1-coachman-2aaa8.cloudfunctions.net/addUser?gmail=${data.email}&firstName=${data.given_name}&familyName=${data.family_name}&access_token=${success.access_token}`)
          .subscribe((userInfo:any)=>{
            console.log(userInfo)
          })
        }
        ,error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
      }, (error) => {
        alert(error);
      });
  };
 
  public googleLogin(): Promise<any> {
    return new Promise(function (resolve, reject) {
      const url = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}` +
        "&redirect_uri=	http://localhost:8100" +
        "&scope=https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/fitness.activity.write  https://www.googleapis.com/auth/fitness.activity.read" +
        "&response_type=token id_token";
      const browserRef = window.cordova.InAppBrowser.open(
        url,
        "_blank",
        "location=no, clearsessioncache=yes, clearcache=yes"
      );
      let responseParams: string;
      let parsedResponse: Object = {};
      browserRef.addEventListener("loadstart", (evt) => {
        if ((evt.url).indexOf("http://localhost:8100") === 0) {
          browserRef.removeEventListener("exit", (evt) => { });
          browserRef.close();
          responseParams = ((evt.url).split("#")[1]).split("&");
          for (var i = 0; i < responseParams.length; i++) {
            parsedResponse[responseParams[i].split("=")[0]] = responseParams[i].split("=")[1];
          }
          if (parsedResponse["access_token"] !== undefined &&
            parsedResponse["access_token"] !== null) {
            resolve(parsedResponse);
          } else {
            reject("Problème d’authentification avec Google");
          }
        }
      });
      browserRef.addEventListener("exit", function (evt) {
        reject("Une erreur est survenue lors de la tentative de connexion à Google");
      });
    });
  } 
}
