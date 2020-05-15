import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { PasswordValidators } from './../../../shared/validators/password.validators';
import { AuthService } from './../auth.service';
import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  userSignupForm : FormGroup;
  isLoading : boolean = false;
  signupSubs : Subscription;


  constructor(private authService : AuthService,
              private router : Router) { }

  ngOnInit() {
    this.userSignupForm = new FormGroup({
      'userName' : new FormControl('', [Validators.required, Validators.minLength(5)]),
      'userEmail' : new FormControl('', [Validators.required, Validators.email]),
      'userPassword' : new FormControl('', [Validators.required, PasswordValidators.passwordStrength]),
      'userLocation' : new FormControl('', [Validators.required])
    });
  }

  get userName() {
    return this.userSignupForm.get('userName');
  }

  get userEmail() {
    return this.userSignupForm.get('userEmail');
  }

  get userPassword() {
    return this.userSignupForm.get('userPassword');
  }

  get userLocation() {
    return this.userSignupForm.get('userLocation');
  }

  onFormSubmit() {
    this.isLoading = true;
    const userData = new User(
      this.userEmail.value,
      this.userPassword.value,
      this.userName.value,
      this.userLocation.value,
      null,
      null
    );
    this.signupSubs = this.authService.onSignup(userData)
      .subscribe(response => {
        // console.log(response);
        this.isLoading = false;
        this.router.navigate(['/home']);
      })
  }

  ngOnDestroy() {
    if(this.signupSubs) {
      this.signupSubs.unsubscribe();
    }
  }

}
