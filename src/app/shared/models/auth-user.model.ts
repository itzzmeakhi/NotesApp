export class AuthUser {
    public localId : string;
    public idToken : string;
    public expirationDate : Date;
    public email : string;

    constructor(localid : string, idtoken : string, email : string, expireDate : Date) {
        this.localId = localid;
        this.idToken = idtoken;
        this.email = email;
        this.expirationDate = expireDate;
    }

    get _idToken() {
        if(this.expirationDate.getTime() > new Date().getTime()) {
            return this.idToken;
        } else {
            return null;
        }
    }
}