import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { User } from 'src/app/shared/models/user.model';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  loginUserForm : FormGroup;
  isLoading : boolean = false;
  loginSubs : Subscription;

  constructor(private authService : AuthService,
              private router : Router) { }

  ngOnInit() {
    this.loginUserForm = new FormGroup({
      'userEmail' : new FormControl('', [Validators.required,Validators.email]),
      'userPassword' : new FormControl('', [Validators.required])
    });
  }

  get userEmail() {
    return this.loginUserForm.get('userEmail');
  }

  get userPassword() {
    return this.loginUserForm.get('userPassword');
  }

  onFormSubmit() {
    this.isLoading = true;
    const userData = new User(this.userEmail.value, this.userPassword.value, null, null, null, null);
    this.loginSubs = this.authService.onLogin(userData)
      .subscribe(response => {
        this.isLoading = false;
        // console.log(response);
        this.router.navigate(['/home']);
      })
  }

  ngOnDestroy() {
    if(this.loginSubs) {
      this.loginSubs.unsubscribe();
    }
  }

}
