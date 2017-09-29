import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*------ Pages ------*/
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AgentComponent } from './components/agent/agent.component';
import { StatusComponent } from './components/status/status.component';
import { SettingComponent } from './components/setting/setting.component';
import { PupilComponent } from './components/pupil/pupil.component';
import { CodeComponent } from './components/code/code.component';
import { QrFormatComponent } from './components/qr-format/qr-format.component';
/*------ Guard ------*/
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthAccountGuard } from './guards/auth-account.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthAccountGuard] },
  {
    path: '', component: HomeComponent, canActivate: [AuthAdminGuard],
    children: [
      { path: 'reports', component: StatusComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'agents', component: AgentComponent },
      { path: 'pupils', component: PupilComponent },
      { path: 'code', component: CodeComponent },
      { path: 'qrformat', component: QrFormatComponent },
      { path: '', redirectTo: 'reports', pathMatch: 'full' },
      { path: '**', redirectTo: 'reports', pathMatch: 'full' },
    ]
  },
  // otherwise redirect to status
  { path: '', redirectTo: '', pathMatch: "full" },
  { path: '**', redirectTo: '', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
