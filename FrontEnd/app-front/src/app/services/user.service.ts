// Module
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserInfo {
  id?: string,
  username: string,
  gmail: string,
  firstName: string,
  lastName: string,
  access_token: string,
  achievements: number[],
  firstNameLower: string,
  lastNameLower: string,
  friends: string[],
  level: number,
  totalExperience: number
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) {}

  queryByUsername(username: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('username', '==', username))
      .valueChanges();
  }

  queryByGmail(gmail: string): Observable<UserInfo[]> {
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('gmail', '==', gmail))
      .valueChanges();
  }

  semiQueryByFirstName(firstName: string): Observable<UserInfo[]> {
    const c = firstName.charAt(firstName.length - 1);
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('firstNameLower', '>=', firstName.toLowerCase())
        .where('firstNameLower', '<', firstName.toLowerCase().slice(0, -1) + String.fromCharCode(c.charCodeAt(0) + 1)))
      .valueChanges();
  }

  semiQueryByLastName(lastName: string): Observable<UserInfo[]> {
    const c = lastName.charAt(lastName.length - 1);
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('lastNameLower', '>=', lastName.toLowerCase())
        .where('lastNameLower', '<', lastName.toLowerCase().slice(0, -1) + String.fromCharCode(c.charCodeAt(0) + 1)))
      .valueChanges();
  }

  semiQueryByFullName(name: string): Observable<UserInfo[]> {
    const names = name.split(' ');
    const firstName = names[0].toLowerCase();
    const lastName = names[1].toLowerCase();
    const c = lastName.charAt(lastName.length - 1);
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('firstNameLower', '==', firstName)
        .where('lastNameLower', '>=', lastName)
        .where('lastNameLower', '<', lastName.slice(0, -1) + String.fromCharCode(c.charCodeAt(0) + 1)))
      .valueChanges();
  }

}
