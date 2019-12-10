import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedUser: string;

  constructor() {
    this.loggedUser = 'mdupont';
  }
}
