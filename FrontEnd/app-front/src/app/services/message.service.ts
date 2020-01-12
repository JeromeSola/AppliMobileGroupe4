import { Injectable } from '@angular/core';
import { Message } from './message'
import { UserInfo } from '../services/user.service';
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
     this.client=new ApiAiClient({accessToken: accessToken});
  }

  WriteMessage(text: string, isFromUser: boolean){
    const message = new Message(text, isFromUser);
    this.messageList.push(message);

    if (!isFromUser)
      this.ReadMessage(text);

  }

  ReadMessage(text: string){
    let regex:RegExp=/<br>/gi;
    text = text.replace(regex,'');
    this.tts.speak({text: text, locale: 'fr-FR'})
    .then(() => {})
    .catch((reason: any) => console.log(reason));
  }

  getDialogflowOptions(userInfo: UserInfo){
    const options = {
      contexts: [{ name: "oauth2",  lifespan: 1, parameters: {userInfo: userInfo}}]
    };
    return options;
  }
}

