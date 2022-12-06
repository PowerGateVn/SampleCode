import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmissionListPage } from './submission-list.page';

const routes: Routes = [
    {
        path: '',
        component: SubmissionListPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubmissionListPageRoutingModule {}
