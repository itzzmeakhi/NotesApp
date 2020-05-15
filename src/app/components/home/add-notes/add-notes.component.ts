import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { NotesService } from '../services/notes.service';
import { UserService } from './../services/user.service';
import { Note } from 'src/app/shared/models/note.model';


@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.css']
})
export class AddNotesComponent implements OnInit, OnDestroy {

  addNotesForm : FormGroup;
  availableNotes : Note[];
  userRowId : string;
  userId : string;
  isLoading : boolean = false;
  rowIdSubs : Subscription;
  notesSubs : Subscription;
  saveNotesSubs : Subscription;

  constructor(private authService : AuthService,
              private notesService : NotesService,
              private userService : UserService,
              private router : Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.addNotesForm = new FormGroup({
      'noteTitle' : new FormControl('', [Validators.required]),
      'noteDescription' : new FormControl('', [Validators.required])
    });

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
                this.isLoading = false;
              } else {
                this.availableNotes = [...notesData];
                this.isLoading = false;
                // console.log(this.availableNotes);
              }
            })
        }
      });
    

    // this.authService.userLoggedIn
    //   .subscribe(userData=> {
    //     this.userId = userData.localId;
    //     if(this.userId) {
    //       this.userService.getUserRowId(this.userId)
    //         .subscribe(rowId => {
    //           this.userRowId = rowId;
    //         })
    //     }
    //   })
    
  }

  get noteTitle() {
    return this.addNotesForm.get('noteTitle');
  }

  get noteDescription() {
    return this.addNotesForm.get('noteDescription');
  }

  onFormSubmit() {
    this.isLoading = true;
    const newNote = new Note(this.noteTitle.value, 
                             this.noteDescription.value,
                             new Date(),
                             "note" + this.userId.slice(1,5) + new Date().getTime(),
                             null);
    this.availableNotes.push(newNote);
    // console.log(this.availableNotes);
    this.saveNotesSubs = this.notesService.saveNotes(this.availableNotes, this.userRowId)
      .subscribe(response => {
        // console.log(response);
        this.onClearForm();
        this.isLoading = false;
      })
  }

  onClearForm() {
    this.addNotesForm.reset();
  }

  ngOnDestroy() {
    if(this.saveNotesSubs) {
      this.saveNotesSubs.unsubscribe();
    }
    if(this.notesSubs) {
      this.notesSubs.unsubscribe();
    }
    if(this.rowIdSubs) {
      this.rowIdSubs.unsubscribe();
    }
  }

  
}
