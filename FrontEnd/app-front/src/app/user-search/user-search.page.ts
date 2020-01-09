import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService, UserInfo } from '../services/user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.page.html',
  styleUrls: ['./user-search.page.scss'],
})
export class UserSearchPage implements OnInit {

  public query: string;
  private firstNameSubscription: Subscription;
  private lastNameSubscription: Subscription;
  private fullNameSubscription: Subscription;
  public searchResults: UserInfo[];
  public previousProfile: string;
  public userInput: string;
  public nbQuery: number;
  private expectedQuery: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.query = params.get('query');
      this.previousProfile = params.get('previousProfile');
      this.userInput = this.query;
      this.search();
    });
  }

  search() {
    this.searchResults = [];
    this.nbQuery = 0;
    this.expectedQuery = 2;
    this.firstNameSubscription = this.userService.semiQueryByFirstName(this.query)
      .subscribe(users => {
        this.nbQuery++;
        this.addQueryResults(users);
      });
      this.lastNameSubscription = this.userService.semiQueryByLastName(this.query)
      .subscribe(users => {
        this.nbQuery++;
        this.addQueryResults(users);
      });
      if (this.query.split(' ').length > 1) {
        this.expectedQuery++;
        this.fullNameSubscription = this.userService.semiQueryByFullName(this.query)
        .subscribe(users => {
          this.nbQuery++;
          this.addQueryResults(users);
        });
      }
  }

  onClickSearch() {
    this.query = this.userInput;
    this.search();
  }

  ngOnDestroy() {
    this.firstNameSubscription.unsubscribe();
    this.lastNameSubscription.unsubscribe();
    if (this.fullNameSubscription) { this.fullNameSubscription.unsubscribe(); }
  }

  addQueryResults(users: UserInfo[]): void {
    console.log(users.length)
    for (let user of users) { if (!this.isUserInArray(user, this.searchResults)) { this.searchResults.push(user); } }
  }

  isUserInArray(user: UserInfo, array: UserInfo[]) {
    for (let item of array) { if (item.username === user.username) { return true; } }
    return false;
  }

  public get isLoading(): boolean { return this.nbQuery < this.expectedQuery; }

  public get isNoResult(): boolean { return this.searchResults.length === 0; }

}
