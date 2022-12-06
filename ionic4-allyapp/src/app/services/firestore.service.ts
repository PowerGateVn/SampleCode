import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, throwError, zip, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Entity } from '../interfaces/entity';
import { ApiService } from './api.service';
import { ShareDataService } from './share-data.service';
import { map } from 'rxjs/operators';

import { FireStoreStoreageService } from './firestore-storage.service';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnDestroy {
  infoUserSubcription: Subscription;
  firebaseTokenSubcription: Subscription;
  private Items: AngularFirestoreDocument<Entity>;
  item: Observable<Entity>;
  organizationsRef: AngularFirestoreDocument<{}>;
  private firebaseToken: any;
  currentUser: any;
  constructor(
    private fireStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    // private apiService: ApiService,
    private shareDataService: ShareDataService,
    private fireStoreStoreageService: FireStoreStoreageService,
  ) {
    this.infoUserSubcription = this.shareDataService.infoUser.subscribe((result: any) => {
      this.currentUser = result;
    });
    this.firebaseTokenSubcription = this.shareDataService.firebase.subscribe((result: any) => {
      this.firebaseToken = result;
    });
  }
  ngOnDestroy() {
    console.log('on destroy');
    this.unsubscribeSubject();
  }
  unsubscribeSubject() {
    this.infoUserSubcription.unsubscribe();
    this.firebaseTokenSubcription.unsubscribe();
  }
  private async getAuthozire(firebaseToken) {
    return this.afAuth.auth.signInWithCustomToken(firebaseToken);
  }

  async initFireStore(firebaseToken, currentUser) {
    this.firebaseToken = firebaseToken;
    this.currentUser = currentUser;
    await this.getAuthozire(firebaseToken);
    this.organizationsRef = this.fireStore.collection('organizations').doc(`${this.currentUser.organization_id}`);
    this.getDataSaveToStore();
  }
  getDataSaveToStore() {
    this.getTimePeriodsSaveStore();
    this.getcurrentUserSaveStore();
    this.getTeamsSaveStore();
    this.getUserNotificationsSaveStore();
    this.getAllUserSaveStore();
  }
  getcurrentUserSaveStore(id?) {
    const userId = id ? id : this.currentUser.id;
    this.organizationsRef.collection('users').doc(`${userId}`).valueChanges()
      .subscribe((res) => {
        this.fireStoreStoreageService.setcurrentUser(res);
      });
  }

  getcurrentUser(id?) {
    const userId = id ? id : this.currentUser.id;
    return this.organizationsRef.collection('users').doc(`${userId}`).valueChanges();
  }

  getOrganizations() {
    return this.organizationsRef.valueChanges();
  }

  getObjectivesCard(timePriodID, userId?) {
    const id = userId ? userId : this.currentUser.id;
    return this.organizationsRef.collection('objectives', ref => ref.where('time_period.id', '==', timePriodID)
      .where('owner.id', '==', id)
      .where('private', '==', false)).valueChanges();
  }
  getObjectivesCardDetail(objectiveId, userId?) {
    const id = userId ? userId : this.currentUser.id;
    return this.organizationsRef.collection('objectives').doc(objectiveId.toString())
      .valueChanges();
  }

  getObjectivesCardPrivate(timePriodID, userId?, depth?) {
    const id = userId ? userId : this.currentUser.id;
    return this.organizationsRef.collection('objectives', ref => ref.where('time_period.id', '==', timePriodID)
      .where('owner.id', '==', id)
      .where('private', '==', true)
      .where('private_viewer_ids', 'array-contains', [id].toString()))
      .valueChanges();
  }
  getKeyResultPrivate(objectiveId = null) {
    const keyResultPrivateRef = this.organizationsRef.collection('objectives', ref =>
      ref.where(`parent.id`, '==', Number(objectiveId))
        .where('private_viewer_ids', 'array-contains', [this.currentUser.id].toString()));
    return keyResultPrivateRef.valueChanges();
  }

  getTeams() {
    return this.organizationsRef.collection('teams').valueChanges();
  }
  getTeamsSaveStore() {
    this.organizationsRef.collection('teams').valueChanges()
      .subscribe((res) => {
        this.fireStoreStoreageService.setTeams(res);
      });
  }

  getTimePeriods() {
    return this.organizationsRef.collection('time_periods', ref => ref.where('archived', '==', false)).valueChanges();
  }
  getTimePeriodsSaveStore() {
    this.organizationsRef.collection('time_periods').valueChanges()
      .subscribe((res) => {
        this.fireStoreStoreageService.setTimePeriods(res);
      });
  }
  getObjectiveSummary(timePeriodId) {
    return this.organizationsRef.collection('entity_summaries')
      .doc(`users_${this.currentUser.id}_${timePeriodId}`).valueChanges();
  }
  async signOut() {
    return this.afAuth.auth.signOut();
  }

  updateProfileUser(userID) {
    this.organizationsRef.collection('users').doc(`${userID}`).update({
      name: 'Linh1'
    }).then(res => {
      console.log(res);
    });
  }

  getKeyResultPublic(objectiveId) {
    const keyResultPublicRef = this.organizationsRef.collection('objectives', ref =>
      ref.where(`parent.id`, '==', Number(objectiveId))
        .where('private', '==', false));
    return keyResultPublicRef.valueChanges();
  }
  getObjectivePending(timePriodID) {
    return this.organizationsRef.collection('objectives', ref =>
      ref.where('time_period.id', '==', timePriodID)
        .where('private', '==', false))
      .valueChanges();
  }

  getActivityByObject(id, isPrivate) {
    if (!isPrivate) {
      return this.organizationsRef.collection('activities', ref => ref.where('objective.id', '==', Number(id))
        .where('objective.private', '==', false)).valueChanges();
    } else {
      return this.organizationsRef.collection('activities', ref => ref.where('objective.id', '==', id)
        .where('objective.private', '==', true)
        .where('objective.private_viewer_ids', 'array-contains', [this.currentUser.id].toString())).valueChanges();
    }
  };

  getUserNotificationsSaveStore(userId = null) {
    const id = userId ? userId : this.currentUser.id;
    return this.organizationsRef.collection('users')
      .doc(id.toString()).collection('user_notifications').valueChanges().subscribe((res) => {
        // console.log('getUserNotificationsSaveStore');
        // console.log(res);
        // this.fireStoreStoreageService.setUserNofitication(res);
      });
  }
  getAllUserSaveStore() {
    return this.organizationsRef.collection('users').valueChanges().subscribe((res) => {
      this.fireStoreStoreageService.setUserList(res);
    });
  }
  getObjectivesCardStateChange(timePriodID, userId?) {
    const id = userId ? userId : this.currentUser.id;
    return this.organizationsRef.collection('objectives', ref => ref.where('time_period.id', '==', timePriodID)
      .where('owner.id', '==', id)
      .where('private', '==', false)).stateChanges();
  }
  getObjectivesCardPrivateStateChange(timePriodID, userId?) {
    const id = userId ? userId : this.currentUser.id;
    return this.organizationsRef.collection('objectives', ref => ref.where('time_period.id', '==', timePriodID)
      .where('owner.id', '==', id)
      .where('private', '==', true)
      .where('private_viewer_ids', 'array-contains', [id].toString())).stateChanges();
  }
  getKeyResultPrivateStateChange(objectiveId = null) {
    return this.organizationsRef.collection('objectives', ref =>
      ref.where(`parent.id`, '==', Number(objectiveId))
        .where('private_viewer_ids', 'array-contains', [this.currentUser.id].toString()))
      .stateChanges();
  }
  getKeyResultPublicRef(objectiveId) {
    return this.organizationsRef.collection('objectives', ref =>
      ref.where(`parent.id`, '==', Number(objectiveId))
        .where('private', '==', false));
  }

  getActivity(timePriodID, startAd) {
    //  return this.organizationsRef.collection('activities', ref => ref.where('objective.id', '==', 80)
    //   .where('objective.private', '==', false)).valueChanges();
    if (startAd) {
      return this.organizationsRef.collection('activities', ref => ref.where('time_period.id', '==', timePriodID)
        .where('user.id', '==', this.currentUser.id)
        .where('objective.private', '==', false).orderBy('created_at', 'desc').startAfter(startAd).limit(25)).valueChanges();
    } else {
      return this.organizationsRef.collection('activities', ref => ref.where('time_period.id', '==', timePriodID)
        .where('user.id', '==', this.currentUser.id)
        .where('objective.private', '==', false).orderBy('created_at', 'desc').limit(25)).valueChanges();
    }
  }

  getCheckinComments (objecttiveId, checkInId) {
    return this.organizationsRef.collection('objectives')
    .doc(objecttiveId.toString())
    .collection('check_ins')
    .doc(checkInId.toString())
    .collection('comments')
    .valueChanges()
  }

  getCheckinByObjective (objecttiveId, checkInId) {
    return this.organizationsRef.collection('objectives')
    .doc(objecttiveId.toString())
    .collection('check_ins')
    .doc(checkInId.toString())
    .valueChanges()
  }

  getListCommentsOfComment (objectiveId, commentId) {
    return this.organizationsRef.collection('objectives')
    .doc(objectiveId.toString())
    .collection('comments')
    .doc(commentId.toString())
    .collection('comments')
    .valueChanges()
  }
  getCommentByObject (objectiveId, commentId) {
    return this.organizationsRef.collection('objectives')
    .doc(objectiveId.toString())
    .collection('comments')
    .doc(commentId.toString())
    .valueChanges()
  }
}