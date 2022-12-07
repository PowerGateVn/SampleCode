import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormDetailPage } from './form-detail.page';

const routes: Routes = [
    {
        path: '',
        component: FormDetailPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormDetailPageRoutingModule {}
