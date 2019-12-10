import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserInfo {
  id?: string,
  username: string,
  gmail: string,
  firstname: string,
  lastname: string,
  birth: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) {}

  queryByUsername(username: string): Observable<UserInfo[]>{
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('username', '==', username))
      .valueChanges();
  }

  queryByGmail(gmail: string): Observable<UserInfo[]>{
    return this.afs.collection<UserInfo>('Users',
      ref => ref.where('gmail', '==', gmail))
      .valueChanges();
  }

}
