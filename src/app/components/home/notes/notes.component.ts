import { Component, OnInit, OnDestroy } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { UserService } from './../services/user.service';
import { NotesService } from './../services/notes.service';
import { Note } from './../../../shared/models/note.model';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {

  userId : string;
  userRowId : string;
  availableNotes : Note[];
  isNotesDataEmpty : boolean = false;
  isLoading : boolean = false;
  rowIdSubs : Subscription;
  notesSubs : Subscription;

  constructor(private authService : AuthService,
              private userService : UserService,
              private notesService : NotesService) { }

  ngOnInit() {
    this.isLoading = true;
    this.rowIdSubs = this.authService.userLoggedIn
    .pipe(
      switchMap(userData => {
        this.userId = userData?.localId;
        if(this.userId) {
          return this.userService.getUserRowId(this.userId)
        }
      })
    )
    .subscribe(rowId => {
      this.userRowId = rowId;
      if(this.userRowId) {
        this.notesSubs = this.notesService.getNotes(this.userRowId)
          .subscribe((notesData : Note[]) => {
            if(!notesData) {
              this.availableNotes =[];
              this.isNotesDataEmpty = true;
              this.isLoading = false;
            } else {
              this.availableNotes = [...notesData];
              this.isNotesDataEmpty = false;
              this.isLoading = false;
              // console.log(this.availableNotes);
            }
          })
      }
    });
  }

  ngOnDestroy() {
    if(this.notesSubs) {
      this.notesSubs.unsubscribe();
    }
    if(this.rowIdSubs) {
      this.rowIdSubs.unsubscribe();
    }
  }

}
