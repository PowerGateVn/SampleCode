import { Injectable } from '@angular/core';
import { BehaviorSubject, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
    public infoUser = new BehaviorSubject<any>({});
    public firebase = new BehaviorSubject<any>('');
    constructor( ) { }

    getInfoCurrentUser(user) {
        this.infoUser.next(user);
    }

    getFirebaseToken(token) {
        this.firebase.next(token);
    }
}
