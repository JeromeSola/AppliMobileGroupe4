import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent,Platform } from '@ionic/angular';

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
  isLoading: boolean;
  client;
  
  constructor(private mediaCapture: MediaCapture,private tts: TextToSpeech,public platform: Platform) { }

  ngOnInit() {
    this.messageList = Message.getMockList();
    this.client = new ApiAiClient({accessToken: accessToken});
    
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

      this.client
      .textRequest(this.userInput)
      .then(response => {
        console.log(response);
        this.messageList.push(new Message(response.result.fulfillment.speech, false, sendDate))
        this.isLoading = false;
        this.scrollToBottom();
        this.readAssistantMessage(response.result.fulfillment.speech)
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
