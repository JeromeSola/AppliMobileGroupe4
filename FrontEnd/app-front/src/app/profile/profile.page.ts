import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService} from '../services/calendar.service'
import { UserService, UserInfo } from 'src/app/services/user.service';
import { LoginService } from '../services/login.service';
import { GameService, Achievement } from '../services/game.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private calendar:CalendarService,
    private gameService: GameService,
    private alertController: AlertController
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
        for (let id of this.displayedUser.achievements) { this.achievements[id].done = true; }
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
    const alert = await this.alertController.create({
      header: achievement.name,
      message: `${achievement.description} (${achievement.xp} experience).`,
      buttons: ['OK']
    });

    await alert.present();
  }

}
