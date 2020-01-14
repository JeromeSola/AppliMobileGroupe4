import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserCloudFuncService {

  constructor(private http: HttpClient) { }

  public onUserLogin(gmail: string, firstName: string, lastName: string, access_token: string): Observable<any> {
    return this.http.get(`https://us-central1-coachman-2aaa8.cloudfunctions.net/onUserLogin?gmail=${gmail}&firstName=${firstName}&lastName=${lastName}&access_token=${access_token}`);
  }

  public UpdateUserAccessToken(gmail: string,access_token: string):Observable<any>{
    return this.http.get(`https://us-central1-coachman-2aaa8.cloudfunctions.net/updateUserAccessToken?gmail=${gmail}&newAccessToken=${access_token}` )
  }

  public addFriend(gmail: string, friend: string): Observable<any> {
    return this.http.get(`https://us-central1-coachman-2aaa8.cloudfunctions.net/addFriend?gmail=${gmail}&friend=${friend}` );
  }

  public deleteFriend(gmail: string, friend: string): Observable<any> {
    return this.http.get(`https://us-central1-coachman-2aaa8.cloudfunctions.net/deleteFriend?gmail=${gmail}&friend=${friend}` );
  }
}
