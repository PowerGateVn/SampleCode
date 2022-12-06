import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormListPage } from './form-list.page';

const routes: Routes = [
    {
        path: '',
        component: FormListPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormListPageRoutingModule {}
