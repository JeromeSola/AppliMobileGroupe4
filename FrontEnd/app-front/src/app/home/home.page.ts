import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { LoginService } from '../services/login.service';
import { ActivityService, Activity } from '../services/activity.service';
import { UserService, UserInfo } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public activities: Activity[] = [];
  private firstNameMapping: Map<string, string> = new Map<string, string>();
  private lastNameMapping: Map<string, string> = new Map<string, string>();
  private toFinish: number = 0;
  private done: number = 0;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activityService: ActivityService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.loginService.isLoggedIn()) { this.refreshData(null); }
  }

  onRefresh(event: any): void { this.refreshData(event); }

  onFinish(event: any): void {
    this.done++;
    if (this.done == this.toFinish) { event.target.complete(); }
  }

  refreshData(event: any): void {
    this.activities = [];
    this.firstNameMapping.clear();
    this.lastNameMapping.clear();
    if (event != null) { this.toFinish = this.loginService.loggedUser.friends.length * 2 };
    for (let friend of this.loginService.loggedUser.friends) {
      this.userService.queryByGmail(friend)
      .pipe(first()).subscribe((result: UserInfo[]) => {
        this.firstNameMapping.set(friend, result[0].firstName);
        this.lastNameMapping.set(friend, result[0].lastName);
        if (event != null) { this.onFinish(event); }
      });
      this.activityService.getUserActivities(friend)
      .pipe(first()).subscribe((actArray: Activity[]) => {
        for (let act of actArray) {
          this.activities.push(act);
          this.activities.sort(ActivityService.SORT_BY_STARTTIME_DOWN);
        }
        if (event != null) { this.onFinish(event); }
      });
    }
  }

  isFollowingNobody(): boolean {
    return (this.loginService.loggedUser.friends.length === 0);
  }

  onClickChat() {
    this.router.navigate(['/chat']);
  }

  getFirstName(gmail: string): string {
    return this.firstNameMapping.get(gmail);
  }

  getLastName(gmail: string): string {
    return this.lastNameMapping.get(gmail);
  }

  public getActivityTitle(activity: Activity): string {
    if (activity.activityType === 'running') { return `${this.getFirstName(activity.gmail)} ${this.getLastName(activity.gmail)} : Course à pied`; }
    if (activity.activityType === 'pushups') { return `${this.getFirstName(activity.gmail)} ${this.getLastName(activity.gmail)} : Pompes`; }
    return `${this.getFirstName(activity.gmail)} ${this.getLastName(activity.gmail)} : Unknown activity`
  }

  public getActivityDescription(activity: Activity): string {
    if (!activity) { return; }
    if (activity.activityType === 'running') { return `${this.getFirstName(activity.gmail)} a fait ${activity.value} pas.`; }
    if (activity.activityType === 'pushups') { return `${this.getFirstName(activity.gmail)} a fait ${activity.value} pompes.`; }
    return `${activity.value}`;
  }

  public getActivityLength(activity: Activity): string {
    const lengthMilli: number = activity.endTime - activity.startTime;

    const seconds: number = lengthMilli / 1000;
    const minutes: number = lengthMilli / 60000;
    const hours: number = lengthMilli / 3600000;
    const secondsLeft: number = seconds - 60 * Math.floor(minutes);
    const minutesLeft: number = minutes - 60 * Math.floor(hours);

    let str: string = `${seconds} secondes`;
    if (hours >= 1) { str = `${Math.round(hours)}h ${Math.round(minutesLeft)}min ${Math.round(secondsLeft)}sec`; }
    else if (minutes >= 1) { str = `${Math.round(minutes)}min ${Math.round(secondsLeft)}sec`; }

    return str;
  }

  public getStartTime(activity: Activity): string {
    const date = new Date(Math.round(activity.startTime));
    let day: string = `${date.getUTCDate()}`;
    if (date.getUTCDate() < 10) { day = `0${day}`; }
    let month: string = `${date.getUTCMonth() + 1}`;
    if (date.getUTCMonth() + 1 < 10) { month = `0${month}`; }
    let hours: string = `${date.getHours()}`;
    if (date.getHours() < 10) { hours = `0${hours}`; }
    let minutes: string = `${date.getMinutes()}`;
    if (date.getMinutes() < 10) { minutes = `0${minutes}`; }
    return `${day}/${month}/${date.getUTCFullYear()} - ${hours}h${minutes}`;
  }
}
