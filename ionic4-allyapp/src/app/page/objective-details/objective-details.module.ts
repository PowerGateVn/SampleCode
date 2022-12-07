import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';

import { ObjectiveDetailsPage } from './objective-details.page';
import { ChartStatusModule } from '../../components/chart-status/chart-status.module';
import { ObjectiveCardModule } from '../../components/objective-card/objective-card.module';
import { AvatarUserModule } from '../../components/avatar-user/avatar-user.module';
import { ActivityDetailPageModule } from '../../components/activity-detail/activity-detail.module';
import {ModalMoreActionComponent} from "../../components/modal-more-action/modal-more-action.component";

const routes: Routes = [
  {
    path: '',
    component: ObjectiveDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    ActivityDetailPageModule,
    ChartStatusModule,
    ObjectiveCardModule,
    AvatarUserModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      ObjectiveDetailsPage,
      ModalMoreActionComponent
  ],
  entryComponents: [
    ModalMoreActionComponent
  ]
})
export class ObjectiveDetailsPageModule {}
