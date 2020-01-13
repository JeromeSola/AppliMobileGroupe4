import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Activity {
  activityType: string,
  endTime: number,
  gmail: string,
  startTime: number,
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private afs: AngularFirestore) { }

  public getUserActivities(gmail: string): Observable<Activity[]> {
    return this.afs.collection<Activity>('RecordedActivities',
      ref => ref.where('gmail', '==', gmail)).valueChanges();
  }

  public static readonly SORT_BY_STARTTIME_DOWN = function(a1: Activity, a2: Activity): number {
    if (a1.startTime < a2.startTime) { return 1; }
    if (a1.startTime > a2.startTime) { return -1; }
    return 0;
  }

}
