import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { LoginService } from './services/login.service';
import { GameService } from './services/game.service';
import {GoogleFitService} from './services/google-fit.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Pedometer } from '@ionic-native/pedometer/ngx';


@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    GoogleFitService,
    Pedometer,
    StatusBar,
    SplashScreen,
    MediaCapture,
    InAppBrowser,
    TextToSpeech,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    LoginService,
    NativeStorage,
    GameService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
