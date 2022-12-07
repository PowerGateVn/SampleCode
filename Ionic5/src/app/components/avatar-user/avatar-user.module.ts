import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {AvatarUserComponent} from './avatar-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [AvatarUserComponent],
  exports: [AvatarUserComponent]
})
export class AvatarUserModule {}
