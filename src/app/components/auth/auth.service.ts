import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { environment } from './../../../environments/environment';

import { User } from 'src/app/shared/models/user.model';
import { UserResponse } from '../../shared/interfaces/user-response.interface';
import { AuthUser } from 'src/app/shared/models/auth-user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userLoggedIn = new BehaviorSubject<AuthUser>(null);
    expirationTimer : any = null;

    constructor(private http : HttpClient,
                private router : Router) {}

    onSignup(userData : User) {
        return this.http.post<UserResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseKey, {
            email : userData.userEmail,
            password : userData.userPassword,
            returnSecureToken : true
        })
        .pipe(
            tap(responseData => {
                this.handleAuthentication(responseData.localId, responseData.idToken, responseData.email, +responseData.expiresIn);
            }),
            switchMap(responseData => {
                const newUserData = new User(userData.userEmail,
                    null,
                    userData.userName,
                    userData.userLocation,
                    responseData.localId
                    );
                return this.http.post<string>('https://notesapp-f9b95.firebaseio.com/users.json', newUserData)
            })
        )
    }

    onLogin(userData : User) {
        return this.http.post<UserResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseKey, {
            email : userData.userEmail,
            password : userData.userPassword,
            returnSecureToken : true
        })
        .pipe(
            tap(responseData => {
                this.handleAuthentication(responseData.localId, responseData.idToken, responseData.email, +responseData.expiresIn);
            })
        )
    }

    onLogout() {
        this.userLoggedIn.next(null);
        localStorage.removeItem('userNotesApp');
        this.router.navigate(['/login']);
        if(this.expirationTimer) {
            clearTimeout(this.expirationTimer);
        }
        this.expirationTimer = null;
    }

    onAutoLogin() {
        const userSavedInLocalStorage = JSON.parse(localStorage.getItem('userNotesApp'));

        if(!userSavedInLocalStorage) {
            return false;
        }

        const savedUser = new AuthUser(userSavedInLocalStorage.localId, 
                                       userSavedInLocalStorage.idToken, 
                                       userSavedInLocalStorage.email,
                                       new Date(userSavedInLocalStorage.expirationDate));

        if(savedUser._idToken) {
            console.log("Auto Login");
            this.userLoggedIn.next(savedUser);
            const expiresIn : number = new Date(savedUser.expirationDate).getTime() - new Date().getTime();
            this.autoLogout(expiresIn);
            return true;
        } else {
            localStorage.removeItem('userNotesApp');
            return false;
        }

                        
    }

    private autoLogout(expiresIn : number) {
        this.expirationTimer = setTimeout(() => {
            this.onLogout();
        }, expiresIn);
    }

    private handleAuthentication(localid : string, idtoken : string, email : string, expiresIn : number) {
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const loggedInUser = new AuthUser(
            localid,
            idtoken,
            email,
            expirationDate
        );

        localStorage.setItem('userNotesApp', JSON.stringify(loggedInUser));
        this.autoLogout(expiresIn * 1000);
        this.userLoggedIn.next(loggedInUser);
    }

}