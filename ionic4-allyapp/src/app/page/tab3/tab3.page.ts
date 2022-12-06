import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ModalController, LoadingController, Events   } from '@ionic/angular';
import {ModalQuarterDateComponent} from '../../components/modal-quarter-date/modal-quarter-date.component';
import { ApiService } from '../../services/api.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import * as moment from 'moment';
import { TokenFireBase } from 'src/app/interfaces/tokenfirebase';
import { TimePeriod } from 'src/app/interfaces/time-period';
import { okrsByStatusObject } from 'src/app/constants/config';
import { ScrollHideConfig } from 'src/app/interfaces/scroll-hide-config';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  dateNow: any;
  monthDate: number;
  TokenFireBase: TokenFireBase[];
  items: any;
  showSearchBar: any = false;
  timePeriods: any;
  timePeriodSelected: any;
  id: any;
  teams: any = [];
  team: any = [];
  user: any = {
    name: '',
    avatar_url: ''
  };
  dataObjectiveCard: any;
  timePeriodId: any;
  isFabOpen = true;
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
  colorAvgScore: string;
  isActivityTab = false;
  isInfoTab = true;

  constructor(
      public modalController: ModalController,
      private apiService: ApiService,
      private filestoreService: FirestoreService,
      public loadingController: LoadingController,
      private events: Events,
      private authService: AuthService,
      private router: Router,
      private commonService: CommonService,
  ) {
  }

}
