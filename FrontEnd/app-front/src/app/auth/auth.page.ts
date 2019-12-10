import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { googleId } from '../../../../../APIKeys/googleId'
declare var window: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(public navCtrl: NavController,
   private http: HttpClient,
   private platform: Platform,
   private iab: InAppBrowser) { }

  ngOnInit() {
  }

  public login() {
    console.log("ok")
    this.platform.ready()
      .then(this.googleLogin)
      .then(success => {
        console.log(success)
        this.http.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${success.access_token}`)
        .subscribe(data => {
          console.log(data);
          console.log("done")
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
        "&scope=https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email" +
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
