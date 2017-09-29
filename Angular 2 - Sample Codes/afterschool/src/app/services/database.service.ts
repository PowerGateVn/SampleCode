import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {
  AngularFireOfflineDatabase,
  // AfoListObservable,
  // AfoObjectObservable
} from 'angularfire2-offline/database';

@Injectable()
export class DatabaseService {

  constructor(public afoDatabase: AngularFireOfflineDatabase) {

  }

  getAll(collection) {    
    return this.afoDatabase.list(`/` + collection);
  }

  getWhereKey(collection, key) {
    return this.afoDatabase.list(`/` + collection + `/${key}`);
  }

  getWhereLimit(collection, param, value_start, value_end) {
    return this.afoDatabase.list(`/` + collection, {
      query: {
        orderByChild: param,
        startAt: value_start,
        endAt: value_end
      }
    });
  }

  getWhereParam(collection, param, value) {
    return this.afoDatabase.list(`/` + collection, {
      query: {
        orderByChild: param,
        equalTo: value,
      }
    });
  }

  insert(collection, data) {
    return this.afoDatabase.list(`/` + collection).push(data);
  }

  updateWhereKey(collection, key, data) {
    return this.afoDatabase.object(`/` + collection + `/${key}`).update(data);
  }

  deleteWhereKey(collection, key) {
    return this.afoDatabase.object(`/` + collection + `/${key}`).remove();
  }

}