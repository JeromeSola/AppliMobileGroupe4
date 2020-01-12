import { Injectable } from '@angular/core';
import { Message } from './message'
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
     this.messageList.push(new Message('Bonjour dîtes"ok coach"pour commencer à converser avec votre coach personnel',false,new Date()))  
  }

  WriteMessage(text: string, isFromUser: boolean){
    const message = new Message(text, isFromUser,new Date());
    this.messageList.push(message);

    if (!isFromUser)
      this.ReadMessage(text);

  }

  ReadMessage(text: string){
    let regex:RegExp=/<br>/gi;
    text = text.replace(regex,'');
    this.tts.speak({
      text: text,
      locale: 'fr-FR'
    })
    .then(() => {})
    .catch((reason: any) => console.log(reason));
  }

  getDialogflowOptions(access_token: string){
    const options = {
      contexts: [{
        name: "oauth2", 
        lifespan: 1,
        parameters: { userID: access_token}
      }]
    };
    return options;
  }

}

