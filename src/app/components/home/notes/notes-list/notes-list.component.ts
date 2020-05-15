import { Component, OnInit, Input } from '@angular/core';

import { Note } from './../../../../shared/models/note.model';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

  @Input() note : Note;
  toggleFullDescription : boolean = false;
  slicedText : string;
  minimumText : boolean = false;

  constructor() { }

  ngOnInit() {
    if(this.note.noteDescription.length > 15) {
      this.slicedText = this.note.noteDescription.slice(0, 15) + '...';
      this.minimumText = false;
    } else {
      this.slicedText = this.note.noteDescription;
      this.minimumText = true;
    }
  }

  onToggleFullText() {
    this.toggleFullDescription = !this.toggleFullDescription;
  }


}
