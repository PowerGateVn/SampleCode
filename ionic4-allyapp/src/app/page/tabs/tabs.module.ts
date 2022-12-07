import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { ScrollHideDirective } from 'src/app/directives/scroll-hide.directive';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { ModalQuarterDateComponent } from '../../components/modal-quarter-date/modal-quarter-date.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    DirectiveModule
  ],
  declarations: [
      TabsPage,
    ModalQuarterDateComponent,
  ],
  entryComponents: [
    ModalQuarterDateComponent,
  ]
})
export class TabsPageModule {}
