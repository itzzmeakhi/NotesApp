import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Note } from './../../../shared/models/note.model'; 

@Injectable({
    providedIn : 'root'
})
export class NotesService {

    constructor(private http : HttpClient) {}

    saveNotes(notesData : Note[], rowId : string) {
        return this.http.put('https://notesapp-f9b95.firebaseio.com/users/'+rowId+'/userNotes.json', notesData)
    }

    getNotes(rowId : string) {
        return this.http.get('https://notesapp-f9b95.firebaseio.com/users/'+rowId+'/userNotes.json')
    }

}