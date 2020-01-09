import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

import { LoginService } from '../services/login.service';
import { UserInfo } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  private currentInfo: UserInfo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() { this.syncInfo(); }
  ionViewWillEnter() { this.syncInfo() }
  syncInfo() { this.currentInfo = this.loginService.loggedUser; }

  isValidInfo() {
    if (this.currentInfo.firstName === null|| this.currentInfo.firstName === undefined) { return false; }
    if (this.currentInfo.firstName.length === 0) { return false; }
    if (this.currentInfo.lastName === null || this.currentInfo.lastName === undefined) { return false; }
    if (this.currentInfo.lastName.length === 0) { return false; }
    return true;
  }

  onClickSend() {
    console.log('Send');
  }

  async onEditBanner() {
    console.log('Hello');
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo de couverture',
      buttons: [{
        text: 'Supprimer',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete Banner');
        }
      }, {
        text: 'Modifier',
        icon: 'image',
        handler: () => {
          console.log('Edit Banner');
        }
      }, {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel.');
        }
      }]
    });
    await actionSheet.present();
  }

  async onEditProfilePic() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo de profil',
      buttons: [{
        text: 'Supprimer',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete Profile Pic');
        }
      }, {
        text: 'Modifier',
        icon: 'image',
        handler: () => {
          console.log('Edit Profile Pic');
        }
      }, {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel.');
        }
      }]
    });
    await actionSheet.present();
  }

}
