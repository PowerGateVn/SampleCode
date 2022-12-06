import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormioModule } from 'angular-formio';

import { IonicModule } from '@ionic/angular';

import { SubmissionListPageRoutingModule } from './submission-list-routing.module';

import { SubmissionListPage } from './submission-list.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, FormioModule, SubmissionListPageRoutingModule],
    declarations: [SubmissionListPage]
})
export class SubmissionListPageModule {}
