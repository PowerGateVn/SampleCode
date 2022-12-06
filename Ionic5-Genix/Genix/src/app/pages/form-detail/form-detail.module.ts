import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormioModule } from 'angular-formio';

import { IonicModule } from '@ionic/angular';

import { FormDetailPageRoutingModule } from './form-detail-routing.module';

import { FormDetailPage } from './form-detail.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, FormDetailPageRoutingModule, FormioModule],
    declarations: [FormDetailPage]
})
export class FormDetailPageModule {}
