import { Note } from './../models/note.model';

export class User {
    public userEmail : string;
    public userName? : string;
    public userLocation? : string;
    public userPassword? : string;
    public userId? : string;
    public userNotes? : Note[];


    constructor(email : string, 
                password? : string, 
                name? : string, 
                location? : string,
                id? : string,
                notes? : Note[]) {
        this.userName = name;
        this.userEmail = email;
        this.userLocation = location;
        this.userPassword = password;
        this.userId = id;
        this.userNotes = notes;
    }
}