import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ModalController, Events, IonContent } from '@ionic/angular';
import { combineLatest, from } from 'rxjs';
import { isEqual, differenceWith, cloneDeep, flatten, sortedIndexBy, orderBy, findIndex } from 'lodash';

import { ModalQuarterDateComponent } from '../../components/modal-quarter-date/modal-quarter-date.component';
import { ApiService } from '../../services/api.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import * as moment from 'moment';
import { TokenFireBase } from 'src/app/interfaces/tokenfirebase';
import { okrsByStatusObject, indicatorObjective, entityType, typeObjective } from 'src/app/constants/config';
import { ScrollHideConfig } from 'src/app/interfaces/scroll-hide-config';
import { AuthService } from 'src/app/services/auth.service';
import { ShareDataService } from '../../services/share-data.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FireStoreStoreageService } from 'src/app/services/firestore-storage.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { messageIndicator } from 'src/app/constants/message';
import { HelpersService } from 'src/app/services/helpers.service';
import { ObjectiveService } from 'src/app/services/objective.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy {
  objectiveSummarySubcription: Subscription;
  objectiveListSubcription: Subscription;
  teamsSubcription: Subscription;
  currentUserSubcription: Subscription;
  timePeriodsSubcription: Subscription;
  @ViewChild(IonContent) content: IonContent;
  dateNow: any;
  monthDate: number;
  items: any;
  showSearchBar: any = false;
  timePeriods: any;
  timePeriodSelected: any;
  id: any;
  teams: any = [];
  team: any = [];
  user: any;
  objectiveSummary: any;
  chartOrksByStatus: any;
  chartAverageProgress: any;
  colorObjectiveSummary: string = okrsByStatusObject.notStarted.color;
  dataObjectiveCard: any;
  timePeriodId: any;
  isFabOpen = true;
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
  colorAvgScore: string;
  objectiveCardPublic: any;
  objectiveCardPrivate: any;
  showMyOKRpage = true;
  activities: any;
  isEndListActivites: boolean;
  startAd: any;
  dataObjectiveCardPrepare = [];
  constructor(
    public modalController: ModalController,
    private filestoreService: FirestoreService,
    private events: Events,
    private router: Router,
    private shareDataService: ShareDataService,
    private helpersService: HelpersService,
    private commonService: CommonService,
    private fireStoreStoreageService: FireStoreStoreageService,
    private objectiveService: ObjectiveService,
  ) {
    this.startAd = '';
    this.isEndListActivites = false;
    this.activities = [];
    this.events.subscribe('resetData', () => {
      console.log('resetData');
      this.resetData();
    });
    this.behaviorSubjectFireStoreSubscribe();
  }
  async modalQuarterDate() {
    const modal = await this.modalController.create({
      component: ModalQuarterDateComponent,
      componentProps: { timePeriods: this.timePeriods, timePeriodSelected: this.timePeriodSelected },
      backdropDismiss: true,
      cssClass: 'modal-action-sheet modal-quarter-date',
      showBackdrop: true
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('onDidDismiss');
    console.log(data);
    if (data && data.timePeriodSelected !== this.timePeriodSelected) {
      this.timePeriodSelected = data.timePeriodSelected;
      this.resetDataChartAndObjective();
      this.getDataAccrodingTimePeriod();
      this.setHeader();
    }
  }

  getUser(user: any) {
    this.user = user;
  }
  getTeams(teams = []) {
    teams.forEach(e => {
      const name = e.name;
      this.team.push(name);
      this.teams = this.team;
    }, err => { return; });
  }
  getObjectiveList() {
    const objectivePrivateRef = this.filestoreService.getObjectivesCardPrivateStateChange(this.timePeriodSelected.id);
    const objectivePublicRef = this.filestoreService.getObjectivesCardStateChange(this.timePeriodSelected.id);
    combineLatest([objectivePrivateRef, objectivePublicRef]).subscribe(
      results => {
        if (!this.dataObjectiveCardPrepare) {
          this.dataObjectiveCardPrepare = [];
        }
        this.populateAndProcessCollectionChanges(flatten([results[0], results[1]]));
        this.dataObjectiveCardPrepare = orderBy(this.dataObjectiveCardPrepare,
          [
            (item) => item.entity.type,
            (item) => item.entity.name,
            (item) => item.list_view_position,
            (item) => item.created_at
          ], ['asc', 'asc', 'asc', 'desc']
        );
        console.log('this.dataObjectiveCard');
        this.dataObjectiveCard = this.dataObjectiveCardPrepare;
        console.log(this.dataObjectiveCard);
      }
    );
  }
  populateAndProcessCollectionChanges(changes) {
    changes.forEach((change: any) => {
      const obj = change.payload.doc.data();
      if (!(obj.depth === 0 || obj.ancestors[obj.depth - 1].owner.id !== this.user.id)) { return; }
      const index = findIndex(this.dataObjectiveCardPrepare, { id: obj.id });
      // index condition for 'added' to handle mutiple listeners
      if ((change.type === 'added') && (index < 0)) {
        this.objectiveService.populateObjective(obj, index);
        this.dataObjectiveCardPrepare.push(obj);
        return;
      }
      if ((change.type === 'modified') && (index >= 0)) {
        this.objectiveService.populateObjective(obj, index);
        this.helpersService.copyInto(this.dataObjectiveCardPrepare[index], obj);
        return;
      }
      if ((change.type === 'removed') && (index >= 0)) {
        this.dataObjectiveCardPrepare.splice(index, 1);
      }
    });
  }

  getDataAccrodingTimePeriod() {
    this.getObjectiveSummary();
    this.getObjectiveList();
  }
  getObjectiveSummary() {
    this.objectiveSummarySubcription = this.filestoreService.getObjectiveSummary(this.timePeriodSelected.id).subscribe((objectiveSummary: any) => {
      // console.log('objectiveSummary');
      // console.log(new Date());
      const chartValueOrkByStatus = this.prepareToChartOrkByStatus(objectiveSummary.okrs_by_status);
      this.colorObjectiveSummary = this.setColorObjectiveSummary(objectiveSummary.okrs_by_status);
      // test AVG score color
      // objectiveSummary.average_score = Math.random();

      this.colorAvgScore = this.commonService.getAvgScore(objectiveSummary.average_score);
      // calAverageProgress
      const chartAverageProgress = this.prepareToChartAverageProgress(objectiveSummary, this.colorObjectiveSummary);
      this.objectiveSummary = objectiveSummary;
      this.shareDataService.getTimePriodId(this.objectiveSummary);
      // console.log(this.objectiveSummary);
      // console.log({chartValueOrkByStatus, chartAverageProgress, objectiveSummary});
      this.chartOrksByStatus = {
        value: chartValueOrkByStatus.value,
        chartDataSets: [{
          data: chartValueOrkByStatus.data,
          borderWidth: 3,
          hoverBorderWidth: 0,
          backgroundColor: chartValueOrkByStatus.backgroundColor,
        }],
        chartSize: '68px'
      };
      this.chartAverageProgress = {
        value: `${chartAverageProgress.value}%`,
        chartDataSets: [{
          data: chartAverageProgress.data,
          borderWidth: 3,
          hoverBorderWidth: 0,
          backgroundColor: chartAverageProgress.backgroundColor,
        }],
        chartSize: '68px'
      };
    });
  }

  prepareToChartOrkByStatus(okrsByStatus: object) {
    const { atRisk, behind, onTrack, done, postponed, notStarted } = okrsByStatusObject;
    const chartObject = {
      backgroundColor: [],
      data: [],
      value: 0
    };
    chartObject.backgroundColor = [atRisk.color, behind.color, onTrack.color, done.color, postponed.color, notStarted.color];
    chartObject.data = [okrsByStatus[atRisk.key] || 0, okrsByStatus[behind.key] || 0, okrsByStatus[onTrack.key] || 0,
    okrsByStatus[done.key] || 0, okrsByStatus[postponed.key] || 0, okrsByStatus[notStarted.key] || 0];
    chartObject.data.forEach((objectOrk) => {
      chartObject.value += objectOrk;
    });
    if (chartObject.value === 0) {
      chartObject.data[notStarted.order] = 1;
    }
    return chartObject;
  }

  prepareToChartAverageProgress(objectiveSummary: any, colorObjectiveSummary) {
    const chartObject = {
      backgroundColor: [],
      data: [],
      value: 0
    };
    chartObject.value = objectiveSummary.actual_progress;
    // test
    // chartObject.value = 30;
    chartObject.data = [objectiveSummary.actual_progress, 100 - objectiveSummary.actual_progress];
    chartObject.backgroundColor = [colorObjectiveSummary, okrsByStatusObject.notStarted.color];
    return chartObject;
  }

  setColorObjectiveSummary(okrsByStatus: object) {
    const { atRisk, behind, onTrack, notStarted } = okrsByStatusObject;
    if (okrsByStatus[atRisk.key]) {
      return atRisk.color;
    }
    if (okrsByStatus[behind.key]) {
      return behind.color;
    }
    if (okrsByStatus[onTrack.key]) {
      return onTrack.color;
    }
    return notStarted.color;
  }

  hanldeQuarterDate() {
    const year = moment().year();
    const quater = moment().utc().quarter();
    const name = `Q${quater} ${year}`;
    this.timePeriodSelected = this.timePeriods.find((timePeriod) => {
      return timePeriod.name === name;
    });
  }

  search(ev) {
    // Reset items back to all of the items
    // this.initializeItems();
    // set val to the value of the ev target
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

    // showOKRS() {
    //   this.userInfo.
    // }
  }

  openFabBtn() {
    this.isFabOpen = !this.isFabOpen;
  }

  async gotoLogin() {
    this.router.navigate(['/main-login']);
  }
  async goToCheckin() {
    this.router.navigate(['/multi-check-ins']);
  }
  async goToProfile() {
    this.user.approverString = JSON.stringify(this.user.approver);
    this.router.navigate(['/profile-user', this.user]);
    // console.log(this.user);
    // console.log('goto profile end');
  }

  resetData() {
    this.resetDataChartAndObjective();
    this.user = {};
  }
  resetDataChartAndObjective() {
    this.dataObjectiveCard = null;
    this.chartOrksByStatus = null;
    this.chartAverageProgress = null;
    this.objectiveSummary = null;
    this.dataObjectiveCardPrepare = null;
  }
  getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);
    return unique;
  }

  getAllObjectiveList() {
    // console.log('Public');
     console.log(this.objectiveCardPublic);
    // console.log('Private');
    // console.log(this.objectiveCardPrivate);
     if (!this.objectiveCardPublic || !this.objectiveCardPrivate) {
      return;
    }
     if (this.objectiveCardPrivate.length === 0 && this.objectiveCardPublic.length === 0) {
      this.dataObjectiveCard = [];
    }
     if (this.objectiveCardPublic.length !== 0) {
      let arrObjective = this.objectiveCardPublic;
      if (this.objectiveCardPrivate.length !== 0) {
        arrObjective = this.objectiveCardPublic.concat(this.objectiveCardPrivate);
      }
      this.dataObjectiveCard = this.getUnique(arrObjective.filter(e => e.depth === 0 || (e.ancestors[e.depth - 1].owner.id !== this.user.id)), 'id');

    }
  }

  setHeader() {
    const subHeaderAbsorlute = document.getElementById('subHeaderAbsorlute');
    subHeaderAbsorlute.classList.add('hide-tab-sub-header');
    const header = document.querySelector('ion-header');
    header.style.marginTop = '0px';
    this.content.scrollToTop(1500);
  }

  gotoActivityPage() {
    this.showMyOKRpage = false;
    this.displayActivity();
  }

  gotoMyOKRpage() {
    this.showMyOKRpage = true;
  }

  displayActivity(event = null) {
    // let arrObjectiveId = [];
    // const dataLength = this.dataObjectiveCard.length;
    // for(let i = 0; i < dataLength ; i ++) {
    //   arrObjectiveId.push(this.dataObjectiveCard[i].id)
    // }
    // this.filestoreService.getActivity(this.timePeriodSelected.id, this.startAd, arrObjectiveId).subscribe((res: any) => {
    //   console.log("res", res);
    // });

    this.filestoreService.getActivity(this.timePeriodSelected.id, this.startAd).subscribe((res: any) => {
      if (event !== null) {
        event.target.complete();
      }
      if (res && res.length > 0) {
        this.startAd = res[res.length - 1].created_at;
      } else {
        this.isEndListActivites = true;
      }
      this.activities = this.activities.concat(res);
      // group by activity type
      // const source = from(res)
      // const example = source.pipe(
      //   groupBy(objective => objective.key),
      //   mergeMap(group => group.pipe(toArray()))
      // )
      // const subscribe = example.subscribe(val => console.log(val));
      // console.log("subscribe", example)
      console.log('activities', this.activities);
    });
  }

  loadData(event) {
    this.displayActivity(event);
  }
  behaviorSubjectFireStoreSubscribe() {
    this.timePeriodsSubcription = this.fireStoreStoreageService.timePeriods.subscribe((timePeriods) => {
      // console.log('fireStoreStoreageService: timePeriods');
      if (!timePeriods) {
        return;
      }
      // console.log(timePeriods);
      this.timePeriods = timePeriods;
      this.hanldeQuarterDate();
      this.getDataAccrodingTimePeriod();
    });
    this.currentUserSubcription = this.fireStoreStoreageService.currentUser.subscribe((userInfo) => {
      // console.log('fireStoreStoreageService: userInfo');
      if (!userInfo) {
        return;
      }
      console.log(userInfo);
      this.getUser(userInfo);
    });
    this.teamsSubcription = this.fireStoreStoreageService.teams.subscribe((teams) => {
      // console.log('fireStoreStoreageService: teams');
      if (!teams) {
        return;
      }
      // console.log(teams);
      this.getTeams(teams);
    });
  }
  ngOnDestroy() {
    console.log('on destroy');
    this.unsubscribeSubject();
  }
  unsubscribeSubject() {
    this.timePeriodsSubcription.unsubscribe();
    this.currentUserSubcription.unsubscribe();
    this.teamsSubcription.unsubscribe();
    this.objectiveSummarySubcription.unsubscribe();
    this.events.unsubscribe('resetData');
  }
}
