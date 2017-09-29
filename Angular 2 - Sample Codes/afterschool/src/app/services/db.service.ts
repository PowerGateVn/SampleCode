import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var firebase: any;

@Injectable()
export class DbService {


  constructor() {
  }

  select(collection: string) {
    return firebase.database().ref(collection);
  }

  selectByID(collection: string, id) {
    return firebase.database().ref(collection).child(id);
  }

  insert(collection: string, data) {
    return firebase.database().ref(collection).push(data);
  }

  update(collection: string, id, data) {
    return firebase.database().ref(collection + '/' + id).update(data);
  }

  delete(collection: string, id) {
    return firebase.database().ref(collection).child(id).remove();
  }

  getWhereLimit(collection: string, param, start, end) {
    return firebase.database().ref(collection).orderByChild(param).startAt(start).endAt(end);
  }

  getWhereParam(collection: string, param, value) {
    return firebase.database().ref(collection).orderByChild(param).equalTo(value);
  }

  // get collection by param = field
  getWhere(collection: string, param, field) {
    return firebase.database().ref(collection).orderByChild(param).equalTo(field);
  }

}
