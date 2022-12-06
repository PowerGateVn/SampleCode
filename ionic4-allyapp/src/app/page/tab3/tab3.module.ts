import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ModalQuarterDateComponent } from '../../components/modal-quarter-date/modal-quarter-date.component';
import { ChartsModule } from 'ng2-charts';
import { ObjectiveCardModule } from '../../components/objective-card/objective-card.module';
import { ChartStatusModule } from '../../components/chart-status/chart-status.module';
import { DirectiveModule } from 'src/app/directives/directive.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChartsModule,
    ChartStatusModule,
    ObjectiveCardModule,
    DirectiveModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }])
  ],
  declarations: [
      Tab3Page,
    // ModalQuarterDateComponent,
  ],
  entryComponents: [
    // ModalQuarterDateComponent,
  ]
})
export class Tab3PageModule {}
