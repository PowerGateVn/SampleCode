import { Injectable } from '@angular/core';
import { BehaviorSubject, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
    public infoUser = new BehaviorSubject<any>({});
    public netWorkOnline = new BehaviorSubject<any>('');
    public language = new BehaviorSubject<any>('ar');
    constructor( ) { }

    getInfoCurrentUser(user) {
        this.infoUser.next(user);
    }
    setNetWorkOnline(network) {
        this.netWorkOnline.next(network);
    }
    setLanguage(lang) {
        this.language.next(lang);
    }
    // return string
    public getNetWorkStatus() {
        const netWorkOnline = this.netWorkOnline.getValue();
        return netWorkOnline;
    }

    resetAll() {
        this.infoUser.next(null);
    }
}
