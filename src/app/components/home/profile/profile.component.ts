import { Component, OnInit, OnDestroy } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { UserService } from './../services/user.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userId : string;
  userDetails : User;
  isLoading : boolean = false;
  userDetailsSubs : Subscription;

  constructor(private authService : AuthService,
              private userService : UserService) { }

  ngOnInit() {
    this.isLoading = true;
    this.userDetailsSubs = this.authService.userLoggedIn
    .pipe(
      switchMap(userData => {
        this.userId = userData?.localId;
        if(this.userId) {
          return this.userService.getUser(this.userId)
        }
      })
    )
    .subscribe(userData => {
      this.userDetails = userData;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if(this.userDetailsSubs) {
      this.userDetailsSubs.unsubscribe();
    }
  }

}
