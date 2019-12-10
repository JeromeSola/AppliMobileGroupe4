import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

declare var ApiAIPlugin: any;
declare var ApiAIPromises: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  answer = 'Not ready';
  constructor(public platform: Platform, public ngZone: NgZone, private tts: TextToSpeech) {

  }

   sendVoice() {
    try { 
      this.answer = 'Waiting...'

      ApiAIPlugin.setListeningStartCallback(function () {
        this.answer = 'Listening started...';
      });

      ApiAIPlugin.requestVoice(
        {}, // on peut ajouter des options/contextes/paramètres ici mais pas utiles pour l’instant 
        (response) => {
          this.answer = 'Response processing...'
          this.ngZone.run(() => {
            this.answer = response.result.fulfillment.speech;
            this.tts.speak(this.answer)
              .then(() => console.log('Success'))
              .catch((reason: any) => console.log(reason));
          });
        },
        (error) => {
          this.answer = 'Listening Stopped, error: ' + error.message;
          ApiAIPlugin.stopListening(); 
        });
    } catch (e) {
      this.answer = 'Whoops, error !'
      ApiAIPlugin.stopListening(); 
      alert(e);
    }
}

  
}
