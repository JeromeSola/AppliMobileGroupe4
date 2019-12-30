import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoginService } from 'src/app/services/login.service';
import { StorageService, KEYS } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Accueil',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Assistant',
      url: '/chat',
      icon: 'chatboxes'
    },
    {
      title: 'Paramètres',
      url: '/settings',
      icon: 'settings'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loginService: LoginService,
    private storageService: StorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storageService.getItem(KEYS.LAST_USER_LOGGED)
      .then((resolve) => {
        if (resolve !== undefined && resolve.gmail != undefined) { this.loginService.loginAs(resolve.gmail); }
      }, (reject) => {
        if (reject.code !== 2) {
          console.error('Unknown native storage error :');
          console.error(reject);
        }
      });
    });
  }

}
