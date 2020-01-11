import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent,Platform } from '@ionic/angular';

import { LoginService } from 'src/app/services/login.service';
import { MessageService } from '../services/message.service';
import { Message } from '../services/message'

import { MediaCapture, MediaFile, CaptureError, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

const SCROLL_ANIMATION_DURATION: number = 500;


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  private _isTextModeEnabled: boolean = true;
  private _userInput: string = '';
  private _messageList: Message[] = [];
  private _lastAudio: MediaFile = null; 
  private access_token_user : string;
  isLoading: boolean;
  
  constructor(private message:MessageService,private http: HttpClient,private mediaCapture: MediaCapture,public platform: Platform,private loginService: LoginService,private router: Router) { }

  ngOnInit() {
      this.access_token_user = this.loginService.loggedUser.access_token;
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  onSendClick(): void {
    if (this.userInput) {
      this.WriteMessage(this.userInput, true);
      const options = {
        contexts: [{
          name: "oauth2", 
          lifespan: 1,
          parameters: { userID: this.access_token_user }
        }]
      };
      this.message.client.textRequest(this.userInput,options)
      .then(response => {
        this.WriteMessage(response.result.fulfillment.speech, false);
        this.DialogFlowInteraction(response);
      })
      .catch(error => {
        console.log('error: ' + error);
      });
    }
    this.userInput = '';
  }

  scrollToBottom(): void { this.content.scrollToBottom(SCROLL_ANIMATION_DURATION); }

  WriteMessage( text: string, isFromUser: boolean){
    this.message.SendMessage(text, isFromUser);
    this.isLoading = isFromUser;
    this.scrollToBottom();
  }

  DialogFlowInteraction(response){
    let dialogflow_params;
    if (response.result.actionIncomplete == false){

        if (response.result.metadata.intentName == "Entrainement"){
          dialogflow_params = response.result.contexts[0].parameters;
        }

        if (response.result.metadata.intentName == "Entrainement - yes"){
          this.isLoading = true;
          dialogflow_params = response.result.contexts[0].parameters;
          const eventAdded = {
            summary: 'Coach Man '+dialogflow_params.activity.charAt(0).toUpperCase() + dialogflow_params.activity.substring(1).toLowerCase(),
            location: '1 Avenue du Dr Albert Schweitzer, 33400 Talence',
            description: 'Seance',
            start: {
              dateTime: dialogflow_params.date+'T'+dialogflow_params.time,
              timeZone: 'Europe/Paris'
            },
            end: {
              dateTime: dialogflow_params.date+'T'+String(parseInt(dialogflow_params.time.substring(0,2))+1)+dialogflow_params.time.substring(2),
              timeZone: 'Europe/Paris'
            },
            attendees: [],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'popup', minutes: 10 }
              ]
            }
          }
          this.http.post(`https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json&access_token=${this.access_token_user}&key=AIzaSyAqdQDXdIX8WGmPXEcTLAepq8A5aag-mJI`,eventAdded)
          .subscribe((data: any) => {
            console.log(data)
            this.WriteMessage('Et voila votre séance est planifié !', false);
          },error => {
            console.log(error)
          });
            
        }

        if (response.result.metadata.intentName == "Progression"){
          console.log("FONCTION PROGRESSION");
          let username=this.loginService.loggedUser.username;
          this.router.navigate([`/profile/${username}`]);
          // Routing vers la page Progression.
        }

        if (response.result.metadata.intentName == "Gamification"){
          console.log("FONCTION GAMIFICATION");
          let username=this.loginService.loggedUser.username;
          this.router.navigate([`/profile/${username}`]);
          // Routing vers la page Gamification.
        }

        if (response.result.metadata.intentName == "Challenge"){
          dialogflow_params = response.result.parameters;
          console.log("FONCTION CHALLENGE");
          this.router.navigate([`/profile/${dialogflow_params.username}`]);
          // Envoie un challenge à "challenger_id" contenu dans les dialogflow_params.
        }

        if (response.result.metadata.intentName == "Start"){
          console.log("FONCTION START");
          this.router.navigate(['/my-activities/']);
          // Routing vers la page Gamification.
        }

    }
  }

  onSwitchMode(): void {
    this.isTextModeEnabled = !this.isTextModeEnabled;
  }

  onSpeak(): void {
    console.log('Speak button pressed.');
    // let options: CaptureAudioOptions = { limit: 3 }
    // this.mediaCapture.captureAudio(options)
    //   .then(
    //     (data: MediaFile[]) => console.log(data),
    //     (err: CaptureError) => console.error(err)
    //   );
  }

  get isTextModeEnabled(): boolean { return this._isTextModeEnabled; }
  set isTextModeEnabled(value: boolean) { this._isTextModeEnabled = value; }

  get userInput(): string { return this._userInput; }
  set userInput(value: string) { this._userInput = value; }

  get messageList(): Message[] { return this._messageList; }
  set messageList(value: Message[]) { this._messageList = value; }

  get lastAudio(): MediaFile { return this._lastAudio; }
  set lastAudio(value: MediaFile) { this._lastAudio = value; }

}
