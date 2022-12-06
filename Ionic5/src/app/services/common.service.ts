import { Injectable } from '@angular/core';
import { differenceWith, pullAllBy, isEqual, differenceBy } from 'lodash';
import { identifierModuleUrl } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
  ) {

  }
  // get value of translate3d tx in css: transform: translate3d(-127px, 0px, 0px); => return -127
  getAbcissa(translate3dValue: any) {
    if (translate3dValue.indexOf('matrix') != -1) {
      return Number(translate3dValue.split(',')[4]);
    }
    const value = translate3dValue.match(/((-?)\d+(?=px))/g);
    if (value != null && value.length > 0) {
      return Number(value[0]);
    }
    return null;
  }
  sortTime(a, b) {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  }

}
