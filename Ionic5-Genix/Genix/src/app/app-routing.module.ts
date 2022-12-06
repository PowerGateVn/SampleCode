import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
    {
        path: '',
        loadChildren: () => import('./pages/form-list/form-list.module').then(m => m.FormListPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'form-detail',
        loadChildren: () => import('./pages/form-detail/form-detail.module').then(m => m.FormDetailPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions',
        loadChildren: () => import('./pages/submissions/submissions.module').then(m => m.SubmissionsPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'submission-list',
        loadChildren: () => import('./pages/submission-list/submission-list.module').then(m => m.SubmissionListPageModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
