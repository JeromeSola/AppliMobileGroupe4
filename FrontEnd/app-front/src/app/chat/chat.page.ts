import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent,Platform } from '@ionic/angular';

import { LoginService } from 'src/app/services/login.service';
import { MediaCapture, MediaFile, CaptureError, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Message } from './message';
import { accessToken } from '../../../../../APIKeys/dialogflow';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import { FormControl} from '@angular/forms';

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
  client;
  
  constructor(private mediaCapture: MediaCapture,private tts: TextToSpeech,public platform: Platform,private loginService: LoginService,) { }

  ngOnInit() {
    this.messageList = Message.getMockList();
    this.client = new ApiAiClient({accessToken: accessToken});
    console.log(this.loginService.loggedUser.access_token);
    this.access_token_user=this.loginService.loggedUser.access_token
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  readAssistantMessage(message){
    this.tts.speak({
      text:message,
      locale: 'fr-FR'
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }

  scrollToBottom(): void { this.content.scrollToBottom(SCROLL_ANIMATION_DURATION); }

  onSendClick(): void {
    if (this.userInput) {
      let sendDate = new Date();
      this.messageList.push(new Message(this.userInput, true, sendDate));
      this.isLoading = true;
      let options = {
        contexts: [{
            name: "oauth2",
            lifespan: 1,
            parameters: {
                userID: this.access_token_user,
            }
        }]
      };
      this.client
      .textRequest(this.userInput,options)
      .then(response => {
        
        console.log(response);
        this.messageList.push(new Message(response.result.fulfillment.speech, false, sendDate))
        this.isLoading = false;
        this.scrollToBottom();
        this.readAssistantMessage(response.result.fulfillment.speech)
        let dialogflow_params;
        if (response.result.actionIncomplete == false){

          if (response.result.metadata.intentName == "Entrainement"){
            dialogflow_params = response.result.parameters;
          }

          if (response.result.metadata.intentName == "Entrainement - yes"){
            console.log(dialogflow_params);
            console.log("FONCTION ENTRAINEMENT CONFIRMER > AJOUTER CALENDAR");
            // Plannifie l'évènement sur Google Calendar.
          }

          if (response.result.metadata.intentName == "Progression"){
            console.log("FONCTION PROGRESSION");
            //this.router.navigate(['/progression']);
            // Routing vers la page Progression.
          }

          if (response.result.metadata.intentName == "Gamification"){
            console.log("FONCTION GAMIFICATION");
            //this.router.navigate(['/gamification']);
            // Routing vers la page Gamification.
          }

          if (response.result.metadata.intentName == "Challenge"){
            dialogflow_params = response.result.parameters;
            console.log("FONCTION CHALLENGE");
            // Envoie un challenge à "challenger_id" contenu dans les dialogflow_params.
          }

        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
      
      this.userInput = '';

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
