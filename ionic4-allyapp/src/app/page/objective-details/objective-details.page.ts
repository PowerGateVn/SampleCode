import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { okrsByStatusObject, entityType, typeObjective, indicatorObjective, buttonBackLink, metricType } from '../../constants/config';
import { ShareDataService } from '../../services/share-data.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { messageIndicator } from 'src/app/constants/message';
import { LoadingService } from 'src/app/services/loading.service';
import { isEqual, differenceWith, cloneDeep, sortBy, flatten, findIndex, uniqWith } from 'lodash';
import { combineLatest, Subscription } from 'rxjs';
import { FireStoreStoreageService } from 'src/app/services/firestore-storage.service';
import { ModalMoreActionComponent } from '../../components/modal-more-action/modal-more-action.component';
import { HelpersService } from 'src/app/services/helpers.service';
import { ObjectiveService } from 'src/app/services/objective.service';
@Component({
  selector: 'app-objective-details',
  templateUrl: './objective-details.page.html',
  styleUrls: ['./objective-details.page.scss'],
})
export class ObjectiveDetailsPage implements OnInit, OnDestroy {
  currentUserSubcripton: Subscription;
  objectiveSubcription: Subscription;
  isFabOpen = true;
  objectiveId: any;
  keyResults: any;
  objectiveDetailCardParent: any;
  title: any;
  value: any;
  dataSets: any;
  chartSize: string;
  timePeriodId: any;
  objectiveDetail: any;
  typeObjective = typeObjective;
  type: any;
  quarter: any;
  user: any;
  alignment: any;
  avatar: any;
  typeKpi = metricType.type;
  colorMessage = indicatorObjective.color;
  imgSize: string;
  imageAvatar: string;
  titleBtn: string;
  tab = 1;
  dataSetsOrigin: { data: any[]; backgroundColor: any; }[];
  keyResultsPublic: any;
  keyResultsPrivate: any;
  activitiesPublic: any;
  activitiesPrivate: any;
  activitiesList: any;
  resetData = false;
  keyResultsRaw: any;
  constructor(
    private config: Config,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private filestoreService: FirestoreService,
    private shareDataService: ShareDataService,
    private router: Router,
    private navCtrl: NavController,
    private fireStoreStoreageService: FireStoreStoreageService,
    public modalController: ModalController,
    private titleService: Title,
    private helpersService: HelpersService,
    private objectiveService: ObjectiveService,

  ) {
    this.config.set('backButtonIcon', 'back-icon');
    this.chartSize = '84px';
    this.imgSize = '24px';
    this.behaviorSubjectFireStoreSubscribe();
  }

  async ngOnInit() {
    const text = this.config.get('backButtonText');
    this.getTitleBtnBack();
    this.objectiveId = this.activatedRoute.snapshot.paramMap.get('id');
    this.setDefault();
    setTimeout(() => {
      this.getObjectiveKeyResult(this.objectiveId);
      this.getAllActivities(this.objectiveId);
    }, 300);
    // this.getObjectiveKeyResult(objectiveId, timePeriodId);
  }

  setDefault() {
    this.dataSets = null;
    this.keyResults = null;
  }
  getTitleBtnBack() {
    this.config.set('backButtonText', this.titleService.getTitle());
  }

  setConfigButtonBack(titleBtnBack) {
    console.log('title BtnBack');
    console.log(titleBtnBack);
    this.config.set('backButtonText', `${titleBtnBack}`);
  }

  openFabBtn() {
    this.isFabOpen = !this.isFabOpen;
  }

  getAllActivities(objectiveId) {
    combineLatest([this.getActivitiesPublic(objectiveId), this.getActivitiesPrivate(objectiveId)]).subscribe(
      results => {
        this.activitiesPublic = results[0];
        this.activitiesPrivate = results[1];
        this.getAllActivitiesList();
      },
    );
  }

  getActivitiesPublic(objectiveId) {
    return this.filestoreService.getActivityByObject(objectiveId, false)
  }

  getActivitiesPrivate(objectiveId) {
    return this.filestoreService.getActivityByObject(objectiveId, true)
  }

  getAllActivitiesList () {
    let temp = this.activitiesPrivate.concat(this.activitiesPublic)
    this.activitiesList = temp.sort((a, b) => {return <any>new Date(b.created_at) - <any>new Date(a.created_at);});
    console.log("list activity detail", this.activitiesList);
  }

  getObjectiveKeyResult(objectiveId) {
    this.objectiveSubcription = this.filestoreService.getObjectivesCardDetail(objectiveId).subscribe((objectiveDetail: any) => {
      console.log('objectiveSubcription');
      this.updateObjective(objectiveDetail);
      this.titleService.setTitle(objectiveDetail.title);
    });
    // fix stateChanges not get all when first call
    combineLatest([
      this.getObjectivePublic(objectiveId, 'snapshotChanges'),
      this.getObjectivePublic(objectiveId, 'stateChanges'),
      this.getObjectivePrivate(objectiveId)]).subscribe(
        results => {
          if (!this.keyResultsRaw) { this.keyResultsRaw = []; }
          console.log('combineLatest');
          console.log(results);
          this.populateAndProcessCollectionChanges(uniqWith(flatten([results[0], results[1], results[2]]), isEqual));
          this.keyResults = sortBy(this.keyResultsRaw, 'position');
        },
      );
  }
  populateAndProcessCollectionChanges(changes) {
    changes.forEach((change: any) => {
      const obj = change.payload.doc.data();
      const index = findIndex(this.keyResultsRaw, { id: obj.id });
      // index condition for 'added' to handle mutiple listeners
      if ((change.type === 'added') && (index < 0)) {
        this.objectiveService.populateObjective(obj, index);
        this.keyResultsRaw.push(obj);
        return;
      }
      if ((change.type === 'modified') && (index >= 0)) {
        this.objectiveService.populateObjective(obj, index);
        this.helpersService.copyInto(this.keyResultsRaw[index], obj);
        return;
      }
      if ((change.type === 'removed') && (index >= 0)) {
        this.keyResultsRaw.splice(index, 1);
      }
    });
  }

  updateObjective(objectiveDetail) {
    // if (isEqual(objectiveDetail, this.objectiveDetailCardParentOrigin)) {
    //   return;
    // }
    console.log(objectiveDetail);
    // this.objectiveDetailCardParentOrigin = cloneDeep(objectiveDetail);
    this.objectiveDetail = cloneDeep(objectiveDetail);
    this.hanldeDisplayobjectiveDetailCard(this.objectiveDetail);
    this.alignment = this.objectiveDetail.ancestors;
    console.log(this.alignment);
    // this.handleAvartarUrl(this.alignment);
  }
  getUser(userInfo: any) {
    this.user = userInfo;
    this.imageAvatar = this.user.thumbnail_url ? this.user.thumbnail_url : '';
  }
  getAnimation() {
    const tabSlide = document.querySelectorAll('.tab-slide');
    setTimeout(() => {
      tabSlide.forEach((tab: Element) => {
        tab.classList.add('tab-animation');
      });
    }, 0);
  }
  getAvatar(id) {
    return this.filestoreService.getcurrentUser(id);
  }

  hanldeDisplayobjectiveDetailCard(objective) {
    const value = this.prepareToChartAverageProgress(objective);
    if (!isEqual(this.value, value)) {
      this.value = value;
    }
    const dataSets = this.hanldleMiniChart(objective);
    if (!this.dataSets) {
      this.dataSetsOrigin = cloneDeep(dataSets);
      this.dataSets = dataSets;
    } else {
      const dif = differenceWith(dataSets, this.dataSetsOrigin, isEqual);
      if (dif && dif.length > 0) {
        this.dataSetsOrigin = cloneDeep(dataSets);
        this.dataSets = dataSets;
      }
    }
    const type = this.handleDisplayTypeObjective(objective.entity.type);
    if (!isEqual(this.type, type)) {
      this.type = type;
    }
    const depth = objective.depth + 1;
    const quarter = this.displayQuarterTime(objective.time_period.start_date, objective.time_period.end_date);
    if (!isEqual(this.quarter, quarter)) {
      this.quarter = quarter;
    }
    // this.getObjectiveKeyResult(objectiveId, depth, objPublic, objPrivate);
    const indicatorMessage = this.handleObjectiveIndicator(objective.indicator);
    if (!isEqual(this.objectiveDetail.indicatorMessage, indicatorMessage)) {
      this.objectiveDetail.indicatorMessage = indicatorMessage;
    }
  }

  back() {
    // this.modalCtrl.dismiss();
    this.tab = 1;
    this.navCtrl.pop();
  }


  prepareToChartAverageProgress(objectiveSummaryMini) {
    const chartObject = {
      value: 0
    };
    chartObject.value = objectiveSummaryMini.progress;
    // console.log(chartObject.value);
    return `${chartObject.value}%`;
  }


  hanldleMiniChart(objectiveDetailCard) {
    const chartObject = [objectiveDetailCard.progress, 100 - objectiveDetailCard.progress];
    let chartObjectColor;
    if (objectiveDetailCard.latest_check_in) {
      chartObjectColor = [this.setColorObjectiveSummary(objectiveDetailCard.latest_check_in.status), okrsByStatusObject.notStarted.color];
    } else {
      chartObjectColor = [okrsByStatusObject.notStarted.color, okrsByStatusObject.notStarted.color];
    }
    const chartAverageProgress = {
      chartDataSets: [{
        data: chartObject,
        backgroundColor: chartObjectColor,
      }],
    };
    return chartAverageProgress.chartDataSets;
  }

  setColorObjectiveSummary(okrsByStatus: number) {
    if (okrsByStatus === okrsByStatusObject.atRisk.key) {
      return okrsByStatusObject.atRisk.color;
    }
    if (okrsByStatus === okrsByStatusObject.behind.key) {
      return okrsByStatusObject.behind.color;
    }
    if (okrsByStatus === okrsByStatusObject.onTrack.key) {
      return okrsByStatusObject.onTrack.color;
    }
    if (okrsByStatus === okrsByStatusObject.done.key) {
      return okrsByStatusObject.done.color;
    }
    if (okrsByStatus === okrsByStatusObject.postponed.key) {
      return okrsByStatusObject.postponed.color;
    }
    return okrsByStatusObject.postponed.color;
  }

  goAlignment() {
    this.router.navigate(['/alignment']);
    console.log('goto alignment');
  }

  goToDetailsPage() {
    this.tab = 0;
    this.getAnimation();
  }

  goToKeyResultPage() {
    this.tab = 1;
  }

  goToActivityPage() {
    this.tab = 2;
    this.getAnimation();
  }

  handleDisplayTypeObjective(obj) {
    if (obj === entityType.users) {
      return typeObjective.individual;
    }
    if (obj === entityType.organizations) {
      return typeObjective.company;
    }
    if (obj === entityType.teams) {
      return typeObjective.team;
    }
  }

  handleTimeUpdate(utc) {
    return moment(utc).format('LL');
  }

  displayQuarterTime(start, end) {
    return this.formatQuarterTime(start) + ' - ' + this.formatQuarterTime(end);
  }

  formatQuarterTime(quarter) {
    return moment(quarter).format('MMMM DD');
  }

  handleObjectiveIndicator(data) {
    if (data.inherited === true) {
      if (data.color === indicatorObjective.color.red) {
        return messageIndicator.statusColorRed;
      }
      if (data.color === indicatorObjective.color.orange) {
        return messageIndicator.statusColorOrange;
      }
    } else {
      return data.satisfied_rules;
    }
  }

  getObjectivePublic(objectiveId, streamingType = 'stateChanges') {
    if (streamingType == 'stateChanges') {
      return this.filestoreService.getKeyResultPublicRef(objectiveId).stateChanges();
    }
    return this.filestoreService.getKeyResultPublicRef(objectiveId).snapshotChanges();
  }

  getObjectivePrivate(objectiveId) {
    return this.filestoreService.getKeyResultPrivateStateChange(objectiveId);
  }

  showAlignment(alignment) {
    this.titleService.setTitle(alignment.title);
    this.router.navigate(['tabs/details', alignment.id]);
  }
  behaviorSubjectFireStoreSubscribe() {
    this.currentUserSubcripton = this.fireStoreStoreageService.currentUser.subscribe((userInfo) => {
      if (!userInfo) {
        return;
      }
      this.getUser(userInfo);
    });
  }

  async openMoreAction() {
    const modal = await this.modalController.create({
      component: ModalMoreActionComponent,
      backdropDismiss: true,
      cssClass: 'modal-action-sheet modal-more-active',
      showBackdrop: true
    });
    return await modal.present();
  }
  getName(id) {
    const user = this.fireStoreStoreageService.getUser(id);
    return user.name || '';
  }
  getAvartar(id) {
    const user = this.fireStoreStoreageService.getUser(id);
    return user.thumbnail_url || '';
  }
  ngOnDestroy() {
    console.log('on destroy');
    this.unsubscribeSubject();
  }
  unsubscribeSubject() {
    this.objectiveSubcription.unsubscribe();
    this.currentUserSubcripton.unsubscribe();
  }
}
