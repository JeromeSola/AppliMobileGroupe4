import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { MediaCapture, MediaFile, CaptureError, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';

import { Message } from './message';

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

  constructor(private mediaCapture: MediaCapture) { }

  ngOnInit() {
    this.messageList = Message.getMockList();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void { this.content.scrollToBottom(SCROLL_ANIMATION_DURATION); }

  onSendClick(): void {
    if (this.userInput) {
      let sendDate = new Date();
      this.messageList.push(new Message(this.userInput, true, sendDate));
      this.messageList.push(new Message('Je n\'ai pas compris.', false, sendDate));
      this.userInput = '';
      this.scrollToBottom();
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
