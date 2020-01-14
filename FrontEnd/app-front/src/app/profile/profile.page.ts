import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService} from '../services/calendar.service'
import { UserService, UserInfo } from 'src/app/services/user.service';
import { LoginService } from '../services/login.service';
import { GameService, Achievement } from '../services/game.service';
import { ActivityService, Activity } from '../services/activity.service';

import { first } from 'rxjs/operators';
import { UserCloudFuncService } from '../services/user-cloud-func.service';

const INITIAL_TAB: number = 1;
interface Event {
  summary:string,
  description:string,
  start:any,
  end:any,
}
interface UserAchivement extends Achievement {
  done: boolean
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;

  public currentTab: number = INITIAL_TAB;
  private userInput: string;
  private username: string;
  private displayedUser: UserInfo;
  private userSubscription: Subscription;
  public slideOpts: any = {
    initialSlide: INITIAL_TAB,
    speed: 400
  };
  private eventList:Event[]=[];
  public achievements: UserAchivement[] = [];
  public activities: Activity[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private calendar:CalendarService,
    private gameService: GameService,
    private alertController: AlertController,
    private activityService: ActivityService,
    private cloudFunc: UserCloudFuncService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      this.userSubscription = this.userService.queryByUsername(this.username)
      .subscribe(users => {
        this.displayedUser = users[0];
        const el: HTMLElement = document.querySelector('.progress-fill');
        const value: string = `${this.gameService.getUserPercentage(this.displayedUser.totalExperience,this.displayedUser.level)}%`;
        el.style.setProperty('width', value);
        this.achievements = []
        for (let achievement of this.gameService.achievements) {
          this.achievements.push({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            xp: achievement.xp,
            done: false
          });
        }
        for (let id of this.displayedUser.achievements) {
          if (this.achievements.length > 0) {
            for (let i=0; i<this.achievements.length; i++) {
              if (this.achievements[i].id == id) {
                this.achievements[i].done = true;
              }
            }
          }
        }
        this.activityService.getUserActivities(this.displayedUser.gmail)
        .subscribe((activities: Activity[]) => {
          this.activities = activities.sort(ActivityService.SORT_BY_STARTTIME_DOWN);
        });
      });
    });
    
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.userInput = '';
    this.calendar.getMySportEvents(this.loginService.loggedUser.access_token)
    .subscribe((data: any) => {
      this.eventList=data.items
      console.log(data)
      console.log(this.eventList)
    },(error)=>{
      this.eventList=[{
        summary:"Error",
        description:"Error",
        start:"Error",
        end:"Error"
      }]
      if(error.status===401){
        this.loginService.login()
      }
    })
  }

  public isFollowing(): boolean {
    if (this.isLoggedUser()) { return true }
    if (!this.displayedUser) { return false }
    for (let gmail of this.loginService.loggedUser.friends) {
      if (this.displayedUser.gmail == gmail) { return true; }
    }
    return false;
  }

  public onClickUnfollow(): void {
    this.cloudFunc.deleteFriend(this.loginService.loggedUser.gmail, this.displayedUser.gmail)
    .pipe(first()).subscribe(response => {
      console.log(JSON.stringify(response));
    });
  }

  public onClickFollow(): void {
    this.cloudFunc.addFriend(this.loginService.loggedUser.gmail, this.displayedUser.gmail)
    .pipe(first()).subscribe(response => {
      console.log(JSON.stringify(response));
    });
  }

  isLoggedUser() {
    if (this.displayedUser === null || this.displayedUser === undefined ||
      this.loginService.loggedUser === null || this.loginService.loggedUser === undefined)
      return false;
    return ( this.displayedUser.username == this.loginService.loggedUser.username );
  }

  onClickSearch() {
    if (this.userInput != null && this.userInput.length > 0)
      this.router.navigateByUrl(`/user-search/${this.username}/${this.userInput}`);
  }

  inputEventHanlder(keyCode: number) {
    if (keyCode == 13)
      this.onClickSearch();
  }

  onClickEdit() {
    this.router.navigateByUrl('/edit-profile');
  }

  async onClickTab(tab: number) {
    this.currentTab = tab;
    await this.slider.slideTo(this.currentTab);
  }

  async slideChanged() {
    this.currentTab = await this.slider.getActiveIndex();
  }

  onClickDeleteEvent(eventId){
    console.log(eventId)
    this.calendar.deleteSportEvent(this.loginService.loggedUser.access_token,eventId)
    .subscribe((data: any) => {
      this.calendar.getMySportEvents(this.loginService.loggedUser.access_token)
      .subscribe((data: any) => {
        this.eventList=data.items
        console.log(data)
        console.log(this.eventList)
      },(error)=>{
        this.eventList=[{
          summary:"Error",
          description:"Error",
          start:"Error",
          end:"Error"
        }]
        if(error.status===401){
          this.loginService.login()
        }
      })
    },(error)=>{
      if(error.status===401){
        this.loginService.login()
      }
    })
  }

  isEventOutdated(time){
    return new Date()<new Date(time)
  }

  public async onClickAchievement(achievement: UserAchivement) {
    let message: string = `${achievement.description} (${achievement.xp} experience). `;
    if (achievement.done) { message += '(Succès débloqué)'}
    else { message += '(Succès non-débloqué)'}
    const alert = await this.alertController.create({
      header: achievement.name,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  public getActivityTitle(activity: Activity): string {
    if (activity.activityType === 'running') { return 'Course à pied'; }
    if (activity.activityType === 'pushups') { return 'Pompes'; }
    return 'Unknown activity'
  }

  public getActivityDescription(activity: Activity): string {
    if (!activity) { return; }
    if (activity.activityType === 'running') { return `${this.displayedUser.firstName} a fait ${activity.value} pas.`; }
    if (activity.activityType === 'pushups') { return `${this.displayedUser.firstName} a fait ${activity.value} pompes.`; }
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
