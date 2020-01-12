import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent,Platform } from '@ionic/angular';

import { LoginService } from 'src/app/services/login.service';
import { UserInfo} from '../services/user.service';
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
  private userInfo: UserInfo;
  isLoading: boolean;
  
  constructor(
    private message:MessageService,
    private http: HttpClient,
    private mediaCapture: MediaCapture,
    public platform: Platform,
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit(){
    this.userInfo = this.loginService.loggedUser;
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  onSendClick(): void {
    this.SendMessageToFront(this.userInput, true);
    this.SendMessageToDialogflow(this.userInput);
    this.ResetInput();
  }

  SendMessageToFront(text: string, isFromUser: boolean) : void {
    this.isLoading = false;
    this.message.WriteMessage(text, isFromUser);
    this.scrollToBottom();
  }

  SendMessageToDialogflow(text: string){
    this.isLoading = true;
    const options = this.message.getDialogflowOptions(this.userInfo);
    this.message.client.textRequest(text,options)
    .then(response => { 
      this.MessageAction(response);
      this.SendMessageToFront(response.result.fulfillment.speech, false); 
    })
    .catch(error => {  this.SendMessageToFront('Désolé, nous avons rencontré une erreur: ' + error, false); });
  }

  ResetInput(){
    this.userInput = '';
  }

  MessageAction(response){

    if (response.result.actionIncomplete == false){

      switch (response.result.metadata.intentName) {
        case "Entrainement - yes":
          //this.router.navigate([`/my-planning/`]);
          break;

        case "Progression":
          this.router.navigate([`/profile/${this.userInfo.username}`]);
          break;

        case "Gamification":
          this.router.navigate([`/profile/${this.userInfo.username}`]);
          break;

        case "Start":
          this.router.navigate(['/my-activities/']);
          break;

        case "Rechercher":
            if (response.result.fulfillment.speech == "Désolé, nous n'avons pas trouver l'utilisateur que vous chercher.")
              break;
            const num = response.result.fulfillment.speech.search(/[^\w\s]/g);
            this.router.navigate([`/profile/${response.result.fulfillment.speech.slice(num+2)}`]);   
            break;     

        case "Challenge":
          this.router.navigate([`/profile/${response.result.parameters.challenger_name[0]}`]);   
          break;     
      }
    }
  }

  scrollToBottom(): void { this.content.scrollToBottom(SCROLL_ANIMATION_DURATION); }

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
