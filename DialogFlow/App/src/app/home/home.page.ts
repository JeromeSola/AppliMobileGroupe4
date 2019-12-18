import { Component, ViewChild } from '@angular/core';
import { Platform, IonContent } from '@ionic/angular';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Message } from './models/message';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  @ViewChild(IonContent,{ static: true }) content: IonContent;
  accessToken: string = 'c5ea49c3691846959cf9c5be2afb0296';
  client;
  messages: Message[] = [];
  messageForm: any;
  chatBox: any;
  isLoading: boolean;

  constructor(public platform: Platform, public formBuilder: FormBuilder) {
    this.chatBox = '';

    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.client = new ApiAiClient({accessToken: 'c5ea49c3691846959cf9c5be2afb0296'});
  }

  sendMessage(req: string) {
    if (!req || req === '') {
      return;
    }
    this.messages.push({ from: 'user', text: req });
    this.isLoading = true;
    console.log('On envoie a DialogFlow: ' + req);

    this.client
      .textRequest(req)
      .then(response => {
        console.log(response);
        this.messages.push({
          from: 'bot',
          text: response.result.fulfillment.speech
        });
        this.scrollToBottom();
        this.isLoading = false;
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });

    this.chatBox = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }
}