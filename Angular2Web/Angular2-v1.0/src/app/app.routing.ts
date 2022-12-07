import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

// Components
import { ContentComponent } from './components/content/content.component';

// Guards
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthAccountGuard } from './guards/auth-account.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthAccountGuard] },
  {
    path: '', component: HomeComponent, canActivate: [AuthAdminGuard],
    children: [
      { path: 'content', component: ContentComponent },
      { path: '', redirectTo: 'content', pathMatch: 'full' },
      { path: '**', redirectTo: 'content', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '', pathMatch: "full" },
  { path: '**', redirectTo: '', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }