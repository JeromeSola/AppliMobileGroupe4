import { Injectable } from '@angular/core';
import {Message} from './message'
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { accessToken } from '../../../../../APIKeys/dialogflow';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  public messageList:Message[];
  public client:ApiAiClient;

  constructor(private tts: TextToSpeech) {
     this.messageList=[];
     this.client=new ApiAiClient({accessToken: accessToken})  
  }

  SendMessage(text: string, isFromUser: boolean){
    const message = new Message(text, isFromUser);
    this.messageList.push(message);

    if (!isFromUser)
      this.readMessage(text);

  }

  readMessage(text: string){
    let regex:RegExp=/<br>/gi;
    text = text.replace(regex,'');
    this.tts.speak({
      text: text,
      locale: 'fr-FR'
    })
    .then(() => {})
    .catch((reason: any) => console.log(reason));
  }
}
