import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService} from '../services/calendar.service'
import { UserService, UserInfo } from 'src/app/services/user.service';
import { LoginService } from '../services/login.service';

const INITIAL_TAB: number = 1;

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
  private eventList:any=[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private calendar:CalendarService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      this.userSubscription = this.userService.queryByUsername(this.username)
      .subscribe(users => {
        this.displayedUser = users[0];
        const el: HTMLElement = document.querySelector('.progress-fill');
        el.style.setProperty('width', '25%');
      });
    });
    this.calendar.getMySportEvents(this.loginService.loggedUser.access_token)
    .subscribe((data: any) => {
      this.eventList=data.items
      console.log(data)
      console.log(this.eventList)
    },(error)=>{
      this.eventList=[{
        title:"Error"
      }]
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.userInput = '';
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

}
