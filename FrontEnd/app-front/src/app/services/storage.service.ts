import { Injectable } from '@angular/core';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

export const KEYS = Object.freeze({
  LAST_USER_LOGGED: 'COACH_MAN_LAST_USER'
});

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private nativeStorage: NativeStorage) { }

  public getItem(key: string): Promise<any> { return this.nativeStorage.getItem(key); }

  public setItem(key: string, item: any): Promise<any> { return this.nativeStorage.setItem(key, item); }

  public removeItem(key: string): Promise<any> { return this.nativeStorage.remove(key); }

}