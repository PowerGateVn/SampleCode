import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormManagerService, FormManagerConfig } from 'angular-formio/manager';

import { IonicModule } from '@ionic/angular';

import { FormListPageRoutingModule } from './form-list-routing.module';

import { FormListPage } from './form-list.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, FormListPageRoutingModule],
    declarations: [FormListPage],
    providers: [FormManagerService, { provide: FormManagerConfig, useValue: {} }]
})
export class FormListPageModule {}
