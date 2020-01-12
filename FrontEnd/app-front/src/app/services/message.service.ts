import { Injectable } from '@angular/core';
import {Message} from './message'
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { accessToken } from '../../../../../APIKeys/dialogflow';
@Injectable({
  providedIn: 'root'
})

export class MessageService {
  public messageList:Message[];
  public client:ApiAiClient;
  constructor() {
     this.messageList=[];
     this.client=new ApiAiClient({accessToken: accessToken})
     this.messageList.push(new Message('Bonjour dîtes"ok coach"pour commencer à converser avec votre coach personnel',false,new Date()))  
  }

}
