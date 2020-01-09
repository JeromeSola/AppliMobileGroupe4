import { Component, ViewChild } from '@angular/core';
import { Platform, IonContent } from '@ionic/angular';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { FormControl, FormBuilder } from '@angular/forms';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

var options = {
  contexts: [{
      name: "oauth2",
      lifespan: 1,
      parameters: {
          userID: "XXXXXXXXXXXXXXXXXXXXXXXXX",
      }
  }]
};

var dialogflow_params;

@Component({
  selector: 'app-dialogflow',
  templateUrl: './dialogflow.page.html',
  styleUrls: ['./dialogflow.page.scss'],
})

export class DialogflowPage{
  @ViewChild(IonContent,{ static: true }) content: IonContent;
  
  accessToken: string = 'f0d3757687f8417a9316fb5990828170';
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
    this.client = new ApiAiClient({accessToken: this.accessToken});
  }

  sendMessage(req: string) {
    if (!req || req === '') {
      return;
    }
    this.messages.push({ from: 'user', text: req });
    this.isLoading = true;
    console.log('On envoie a DialogFlow: ' + req);

    this.client
      .textRequest(req, options)
      .then(response => {
        console.log(response);
        this.messages.push({
          from: 'bot',
          text: response.result.fulfillment.speech
        });
        this.scrollToBottom();
        this.isLoading = false;

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
            // Routing vers la page Progression.
          }

          if (response.result.metadata.intentName == "Gamification"){
            console.log("FONCTION GAMIFICATION");
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

    this.chatBox = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }
}