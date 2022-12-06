import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { entityType, okrsByStatusObject, typeObjective, indicatorObjective, buttonBackLink } from '../../constants/config';
import * as moment from 'moment';
import { isEqual, differenceWith, cloneDeep, sortBy, flatten, sortedIndexBy, orderBy } from 'lodash';
import { messageIndicator } from '../../constants/message';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FireStoreStoreageService } from 'src/app/services/firestore-storage.service';
@Component({
  selector: 'app-objective-card',
  templateUrl: './objective-card.component.html',
  styleUrls: ['./objective-card.component.scss'],
})
export class ObjectiveCardComponent implements OnInit, OnChanges {
  @Input() dataObjectiveCard: any;
  @Input() data: any = [];
  @Input() showGroupName: any;
  @Input() titleDefault = false;

  processPercenStatus: any;
  classIcon: string;
  chartObjectColor: any;
  chartSize: string;
  colorMessageObjective = indicatorObjective.colorMess;
  dragged: EventTarget;
  objectiveDataDefault: any;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private titleService: Title,
    private fireStoreStoreageService: FireStoreStoreageService
  ) {
    this.chartSize = '48px';
    this.objectiveDataDefault = new Array(3);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.dataObjectiveCard) { return; }
    this.dataObjectiveCard.forEach((objectiveCard, i) => {
      this.populateObjective(objectiveCard, i);
    });
    // console.log(this.dataObjectiveCard);
  }

  handleDisplayTypeObjective(obj) {
    if (obj === entityType.users) { return typeObjective.individual; }
    if (obj === entityType.organizations) { return typeObjective.company; }
    if (obj === entityType.teams) { return typeObjective.team; }
  }
  populateObjective(objectiveCard, i) {
    if (this.showGroupName) {
      objectiveCard.groupName = this.getGroupName(objectiveCard, i);
      objectiveCard.objectiveNo = this.getObjectiveNo(objectiveCard, i);
    }
  }

  handleTimeUpdate(utc) {
    return moment(utc).format('LL');
  }

  handleClassColor(obj) {
    if (obj.indicator.color === indicatorObjective.color.red && obj.indicator.inherited === true) {
      return indicatorObjective.colorMess.normalDanger;
    }
    if (obj.indicator.color === indicatorObjective.color.orange && obj.indicator.inherited === true) {
      return indicatorObjective.colorMess.normal;
    }
    if (obj.indicator.color === indicatorObjective.color.red && obj.indicator.inherited === false) {
      return indicatorObjective.colorMess.danger;
    }
    if (obj.indicator.color === indicatorObjective.color.orange && obj.indicator.inherited === false) {
      return indicatorObjective.colorMess.warning;
    }
  }
  handleObjectiveIndicator(data) {
    if (!data.inherited) { return data.satisfied_rules; }
    if (data.color === indicatorObjective.color.red) {
      return messageIndicator.statusColorRed;
    }
    if (data.color === indicatorObjective.color.orange) {
      return messageIndicator.statusColorOrange;
    }
  }

  prepareToChartAverageProgress(objectiveSummaryMini) {
    const chartObject = {
      value: 0
    };
    chartObject.value = objectiveSummaryMini.progress;
    // console.log(chartObject.value);
    return `${chartObject.value}%`;
  }


  hanldleMiniChart(dataObjectiveCard) {
    const chartObject = [dataObjectiveCard.progress, 100 - dataObjectiveCard.progress];
    let chartObjectColor;
    if (dataObjectiveCard.latest_check_in) {
      chartObjectColor = [this.setColorObjectiveSummary(dataObjectiveCard.latest_check_in.status), okrsByStatusObject.notStarted.color];
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
    if (okrsByStatus === okrsByStatusObject.atRisk.key) { return okrsByStatusObject.atRisk.color; }
    if (okrsByStatus === okrsByStatusObject.behind.key) { return okrsByStatusObject.behind.color; }
    if (okrsByStatus === okrsByStatusObject.onTrack.key) { return okrsByStatusObject.onTrack.color; }
    if (okrsByStatus === okrsByStatusObject.done.key) { return okrsByStatusObject.done.color; }
    if (okrsByStatus === okrsByStatusObject.postponed.key) { return okrsByStatusObject.postponed.color; }
    return okrsByStatusObject.postponed.color;
  }

  showColorIndicatorMessage(obj) {
    if (!obj.indicator) { return null; }
    if (obj.indicator.color === indicatorObjective.color.red) { return indicatorObjective.colorMess.danger; }
    if (obj.indicator.color === indicatorObjective.color.orange
      && obj.indicator.inherited !== true) { return indicatorObjective.colorMess.warning; }
    if (obj.indicator.color === indicatorObjective.color.orange
      && obj.indicator.inherited === true) { return indicatorObjective.colorMess.normal; }
  }

  gotoDetailsObjective(objective) {
    this.titleDefault && this.titleService.setTitle(buttonBackLink.default);
    this.router.navigate(['tabs/details', objective.id]);
  }
  startDragObjective(e, objective) {
    // console.log('startDragObjective');
    // console.log(e.detail);
    const ionContent = document.querySelector('ion-content');
    ionContent.classList.add('no-slide');
    setTimeout(() => { ionContent.classList.remove('no-slide'); }, 1000);
  }
  fullySwipedObjective(e, objective) {
    // console.log('fullySwipedObjective');
    // console.log(e.detail);
    const ionContent = document.querySelector('ion-content');
    ionContent.classList.remove('no-slide');
  }

  getGroupName(record, recordIndex) {
    if (!this.dataObjectiveCard[recordIndex - 1] || (record.entity.id !== this.dataObjectiveCard[recordIndex - 1].entity.id)) {
      if (record.entity.type === entityType.users) {
        return `${typeObjective.individual} OKRS`;
      }
      return `${record.entity.name} OKRS`;
    }
    return null;
  }
  getObjectiveNo(record, recordIndex) {
    if (recordIndex == 0 || record.entity.id !== this.dataObjectiveCard[recordIndex - 1].entity.id) { return 1; }
    return this.dataObjectiveCard[recordIndex - 1].objectiveNo + 1;
  }
  getName(id) {
    const user = this.fireStoreStoreageService.getUser(id);
    return user.name || '';
  }
  getNameEntity(entity) {
    if (entity.type === entityType.organizations) { return entity.name; }
    if (entity.type === entityType.users) { return this.getName(entity.id); }
    const team = this.fireStoreStoreageService.getTeam(entity.id);
    return `Team: ${team.name || ''}`;
  }
}
