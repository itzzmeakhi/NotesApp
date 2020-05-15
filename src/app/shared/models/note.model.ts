export class Note {
    public noteTitle : string;
    public noteDescription : string;
    public noteCreatedOn : Date;
    public noteId : string;
    public noteRowId? : string;

    constructor(title : string, desc : string, created : Date, id : string, rowId? : string) {
        this.noteTitle = title;
        this.noteDescription = desc;
        this.noteCreatedOn = created;
        this.noteId = id;
        this.noteRowId = rowId;
    }
}