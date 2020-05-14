import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/shared/models/user.model';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginUserForm : FormGroup;

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
    const userData = new User(this.userEmail.value, this.userPassword.value, null, null, null);
    this.authService.onLogin(userData)
      .subscribe(response => {
        // console.log(response);
        this.router.navigate(['/home']);
      })

  }
}
