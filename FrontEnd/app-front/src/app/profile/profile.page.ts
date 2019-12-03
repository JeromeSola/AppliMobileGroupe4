import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { UserInfo } from './userInfo';

const MOCK_USER_SELF = new UserInfo();
MOCK_USER_SELF.username = 'dev';
MOCK_USER_SELF.firstName = 'Dev';
MOCK_USER_SELF.lastName = 'Loper';
MOCK_USER_SELF.age = 21;

const MOCK_USER_OTHER = new UserInfo();
MOCK_USER_OTHER.username = 'jejesola';
MOCK_USER_OTHER.firstName = 'Jérôme';
MOCK_USER_OTHER.lastName = 'Sola';
MOCK_USER_OTHER.age = 23;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private _displayedUser: UserInfo;
  private _isValidUser: boolean;
  private _isCurrentUser: boolean;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.updateDisplayedUser(params.get('id'));      
    });
  }

  updateDisplayedUser(username: string) {
    this.displayedUser = this.getUserData(username);
    this.updateValidUser();
    this.updateCurrentUser();
  }

  getUserData(username: string): UserInfo {
    if (username == MOCK_USER_SELF.username)
      return MOCK_USER_SELF;
    if (username == MOCK_USER_OTHER.username)
      return MOCK_USER_OTHER;
    return null;
  }

  updateValidUser() {
    this.isValidUser = (this.displayedUser != null);
  }

  updateCurrentUser() {
    if (!this.isValidUser)
      return this.isCurrentUser = false;
    return this.isCurrentUser = (this.displayedUser.username == MOCK_USER_SELF.username);
  }

  onClickEdit() {
    console.log('salut');
  }

  get displayedUser(): UserInfo { return this._displayedUser; }
  set displayedUser(value: UserInfo) { this._displayedUser = value; }
  get isValidUser(): boolean { return this._isValidUser; }
  set isValidUser(value: boolean) { this._isValidUser = value; }
  get isCurrentUser(): boolean { return this._isCurrentUser; }
  set isCurrentUser(value: boolean) { this._isCurrentUser = value; }

}
