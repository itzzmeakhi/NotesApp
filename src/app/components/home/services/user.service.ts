import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
    providedIn : 'root'
})
export class UserService {

    constructor(private http : HttpClient) {}

    getUserRowId(userId : string) {
        return this.http.get('https://notesapp-f9b95.firebaseio.com/users.json?orderBy="userId"&equalTo="'+userId+'"')
            .pipe(
                map(userData => {
                    for(const key in userData) {
                        return key
                    }
                })
            )
    }

    getUser(userId : string) {
        return this.http.get('https://notesapp-f9b95.firebaseio.com/users.json?orderBy="userId"&equalTo="'+userId+'"')
            .pipe(
                map(userData => {
                    let userDetails : User;
                    for(const key in userData) {
                        const user = new User(
                            userData[key].userEmail,
                            null,
                            userData[key].userName,
                            userData[key].userLocation,
                            userData[key].userId,
                            userData[key].userNotes ? userData[key].userNotes : []
                        );
                        userDetails = {...user};
                    }
                    return userDetails;
                })
            )
    }

}