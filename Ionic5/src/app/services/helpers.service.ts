import { Injectable } from '@angular/core';
import { differenceWith, isEqual, find, clone } from 'lodash';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  active = false;
  constructor(
    private navCtrl: NavController,
    private router: Router,
  ) {
  }
  isObject(obj: any) {
    return (obj !== null && typeof obj === 'object' && !(obj instanceof Array));
  }

  // // Similar to $.extend but
  // // - doesn't copy properties from prototype
  // // - doesn't copy properties starting with '$'
  copyInto(toObject: any, fromObject: any, deep?) {
    // TODO: Rewrite this and angular.merge/extend based on lodash merge
    for (const prop in fromObject) {
      if (fromObject.hasOwnProperty(prop) && !(/^\$.*/.test(prop))) {
        if (deep && this.isObject(toObject[prop]) && this.isObject(fromObject[prop])) {
          this.copyInto(toObject[prop], fromObject[prop]);
        } else {
          toObject[prop] = fromObject[prop];
        }
      }
    }
  }
  //  compare 2 array
  isEqual(fromData, targetData) {
    const dif = differenceWith(fromData, targetData, isEqual);
    if (dif && dif.length > 0) {
      return false;
    }
    return true;
  }

  compareObject(fromData, targetData) {
    return isEqual(fromData, targetData);
  }

  goBack() {
    this.navCtrl.pop().then(() => {
      // console.log('popping url', this.router.url);
    });
  }
  goBackCheckingRouter(page) {
    const beforeRouter = clone(this.router.url);
    console.log('beforeRouter: ', beforeRouter);
    this.navCtrl.pop().then(() => {
      const router = this.router.url;
      if (beforeRouter !== router) { return; }
      console.log('router: ', router);
      this.navCtrl.navigateBack(page);
    });
  }
  onRouletBack(routerOutlet) {
    if (routerOutlet && routerOutlet.canGoBack()) {
      routerOutlet.pop();
    } else {
      this.navCtrl.navigateRoot(['/tabs/tab1']);
    }
  }
  navigateBack(page) {
    if (page) {
      const beforeRouter = clone(this.router.url);
      this.navCtrl.navigateBack(page).then(() => {
        const router = this.router.url;
        if (beforeRouter !== router) { return; }
        if (router.includes('tab3')) {
          this.navCtrl.navigateRoot(['/tabs/tab3']);
          return;
        }
        this.navCtrl.navigateRoot(['/tabs/tab1']);
      });
      return;
    }
    this.navCtrl.navigateBack('tabs/tab1');
    return;
  }
  actionClickOnId(id: string) {
    const button = document.getElementById(id);
    button.click();
  }
  actionForcusOnId(id: string) {
    const button = document.getElementById(id);
    button.focus();
  }
  getQueryStringParameter(url) {
    let query;
    if (url) {
      if (url.split('?').length > 0) {
        query = url.split('?')[1];
      }
    } else {
      url = window.location.href;
      query = window.location.search.substring(1);
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        const [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, {});
  }

  dateCheck(from, to, check) {
    let fromDate, toDate, checkDate;
    fromDate = Date.parse(from);
    toDate = Date.parse(to);
    checkDate = Date.parse(check);
    if ((checkDate <= toDate && fromDate <= checkDate)) {
      return true;
    }
    return false;
  }


  compareDate(start, end ) {
    let startDate, endDate;
    startDate = Date.parse(start);
    endDate = Date.parse(end);
    if (startDate <= endDate) {
      return true;
    }
    return false;
  }
  unescapeHTML(escapedHTML) {
    return escapedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }

}
