import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ModalQuarterDateComponent } from '../../components/modal-quarter-date/modal-quarter-date.component';
import { ChartsModule } from 'ng2-charts';
import { ObjectiveCardModule } from '../../components/objective-card/objective-card.module';
import { ActivityMyOKRsModule } from '../../components/activity-my-okrs/activity-my-okrs.module';
import { ChartStatusModule } from '../../components/chart-status/chart-status.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { MyFilterPipe } from 'src/app/pipe/owner-objective.pipe';
import { AvatarUserModule } from 'src/app/components/avatar-user/avatar-user.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChartsModule,
    ChartStatusModule,
    ObjectiveCardModule,
    ActivityMyOKRsModule,
    DirectiveModule,
    AvatarUserModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [
    Tab1Page,
    MyFilterPipe
    // ModalQuarterDateComponent,
  ],
  entryComponents: [
    // ModalQuarterDateComponent,
  ]
})
export class Tab1PageModule { }
