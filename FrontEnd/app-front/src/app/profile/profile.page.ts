import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService, UserInfo } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public LOGGED_USERNAME = 'mdupont';

  private userInput: string;
  private username: string;
  private displayedUser: UserInfo;
  private userSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      this.userSubscription = this.userService.queryByUsername(this.username)
      .subscribe(users => { this.displayedUser = users[0]; });
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.userInput = "";
  }

  isLoggedUser() {
    if (this.displayedUser == null)
      return null;
    return ( this.displayedUser.username == this.LOGGED_USERNAME );
  }

  onClickSearch() {
    if (this.userInput != null && this.userInput.length > 0)
      this.router.navigateByUrl(`/profile/${this.userInput}`);
  }

  inputEventHanlder(keyCode: number) {
    if (keyCode == 13)
      this.onClickSearch();
  }

  onClickEdit() {
    console.log('salut');
  }

}
