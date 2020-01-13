// Module
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Variable & Interface
import { googleId } from '../../../../../APIKeys/googleId';
import { UserInfo } from './user.service';

// Service 
import { UserService } from './user.service';
import { UserCloudFuncService } from './user-cloud-func.service';
import { StorageService, KEYS } from '../services/storage.service';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedUser: UserInfo;

  constructor(private http: HttpClient,
    private platform: Platform,
    private cloudFunc: UserCloudFuncService,
    private storageService: StorageService,
    private router: Router,
    private userService: UserService
  ) {
    this.loggedUser = null;
  }

  public isLoggedIn(): boolean {
    return (this.loggedUser != null);
  }

  public logOut(): void {
    this.storageService.removeItem(KEYS.LAST_USER_LOGGED);
    this.loggedUser = null;
    this.router.navigateByUrl('/home');
  }

  public loginAs(gmail: string) {
    this.userService.queryByGmail(gmail)
    .subscribe((users: UserInfo[]) => {
      let firstLogin: boolean = false;
      if (this.loggedUser === null || this.loggedUser === undefined) { firstLogin = true;}
      this.loggedUser = users[0];
      this.storageService.setItem(KEYS.LAST_USER_LOGGED, this.loggedUser);
      if (firstLogin) { this.router.navigateByUrl('/home'); }
    });
  }

  public login() {
    this.platform.ready()
      .then(this.googleLogin)
      .then(success => {
        console.log(success)
        this.http.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${success.access_token}`)
        .subscribe((data: any) => {
          this.router.navigateByUrl('/loading');
          let gmail = data.email;
          let firstName = data.given_name;
          let lastName = data.family_name;
          let access_token = success.access_token;
          this.cloudFunc.onUserLogin(gmail, firstName, lastName, access_token)
          .subscribe((userInfo: UserInfo) => {
            this.cloudFunc.UpdateUserAccessToken(gmail,access_token)
            .subscribe((info:any)=>{
              this.loginAs(userInfo.gmail);
            },(error) => {
              console.error(error)})
            
          });
        }
        , error => {
          console.error(error.status);
          console.error(error.error); 
          console.error(error.headers);
        });
      }, (error) => {
        console.error(error);
      });
  };
 
  public googleLogin(): Promise<any> {
    return new Promise(function (resolve, reject) {
      const url = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}` +
        "&redirect_uri=	http://localhost:8100" +
        "&scope=https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/fitness.activity.write  https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"+
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
  
  RedirectionPage(name: string){
    if (name == '/profile/') 
      this.router.navigate([`/profile/${this.loggedUser.username}`]);
    else  this.router.navigate([name]);
  }
}
