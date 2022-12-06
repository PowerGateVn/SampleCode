import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionsPageRoutingModule } from './submissions-routing.module';

import { SubmissionsPage } from './submissions.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, SubmissionsPageRoutingModule],
    declarations: [SubmissionsPage]
})
export class SubmissionsPageModule {}
