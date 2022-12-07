import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormioModule } from 'angular-formio';

import { LoginPage } from './login.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormioModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoginPage
            }
        ])
    ],
    declarations: [LoginPage]
})
export class LoginPageModule {}
