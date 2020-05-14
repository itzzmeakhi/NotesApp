import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AddNotesComponent } from './components/home/add-notes/add-notes.component';

import { AuthGuardService } from './components/auth/auth-guard.service';
import { NotesComponent } from './components/home/notes/notes.component';
import { ProfileComponent } from './components/home/profile/profile.component';



const appRoutes : Routes = [
    { path : '', redirectTo : 'home', pathMatch : 'full' },
    { path : 'login', component : LoginComponent },
    { path : 'signup', component : SignupComponent },
    { path : 'home', component : HomeComponent, canActivate : [AuthGuardService], children : [
        { path : '', component : AddNotesComponent, pathMatch : 'full' },
        { path : 'notes', component : NotesComponent },
        { path : 'profile', component : ProfileComponent }
    ]}
];


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'})
    ],
    exports : [
        RouterModule
    ]
})
export class AppRoutingModule {}