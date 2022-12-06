import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { NotAuthGuard } from 'src/app/guard/not-auth.guard';
const routes: Routes = [
  { path: '', loadChildren: './page/tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './page/login/login.module#LoginPageModule' },
  { path: 'main-login', loadChildren: './page/main-login/main-login.module#MainLoginPageModule', canActivate: [NotAuthGuard] },
  { path: 'alignment', loadChildren: './page/objective-details/alignment/alignment.module#AlignmentPageModule' },
  { path: 'profile-user', loadChildren: './page/profile-user/profile-user.module#ProfileUserPageModule', canActivate: [AuthGuard]},
  { path: 'comment', loadChildren: './page/comment/comment.module#CommentPageModule' },
  { path: 'modal-user-liked', loadChildren: './page/comment/modal-user-liked/modal-user-liked.module#ModalUserLikedPageModule' },
  { path: 'check-in', loadChildren: './page/check-in/check-in.module#CheckInPageModule' },
  { path: 'check-in-status', loadChildren: './page/check-in/check-in-status/check-in-status.module#CheckInStatusPageModule' },
  { path: 'multi-check-ins', loadChildren: './page/check-in/multi-check-ins/multi-check-ins.module#MultiCheckInsPageModule' },
  { path: 'mark-as-done', loadChildren: './page/check-in/mark-as-done/mark-as-done.module#MarkAsDonePageModule' },
  { path: 'score', loadChildren: './page/check-in/score/score.module#ScorePageModule' },



  // { path: 'modal-quarter-date', loadChildren: './page/modal-quarter-date/modal-quarter-date.module#ModalQuarterDatePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
