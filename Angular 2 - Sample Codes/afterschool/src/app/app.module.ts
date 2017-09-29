import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/*------ Libraries ------*/
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import * as $ from 'jquery';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireOfflineModule } from 'angularfire2-offline';
/*------ Components ------*/
import { HeaderComponent } from './components/header/header.component';
import { AsideComponent } from './components/aside/aside.component';
import { AgentComponent } from './components/agent/agent.component';
import { StatusComponent } from './components/status/status.component';
import { SettingComponent } from './components/setting/setting.component';
import { PupilComponent } from './components/pupil/pupil.component';
import { CodeComponent } from './components/code/code.component';
/*------ Pages ------*/
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
/*------ Services ------*/
import { DbService } from './services/db.service';
import { DatabaseService } from './services/database.service';
import { UploadService } from './services/upload.service';
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthAccountGuard } from './guards/auth-account.guard';
import { SortDataPipe } from './pipes/sort-data.pipe';
import { SearchTextPipe } from './pipes/search-text.pipe';
import { PupilSearchPipe } from './pipes/pupil-search.pipe';
import { PupilSortPipe } from './pipes/pupil-sort.pipe';
import { CommonService } from './services/common.service';
import { StatusSearchPipe } from './pipes/status-search.pipe';
import { StatusSortPipe } from './pipes/status-sort.pipe';
import * as firebase from 'firebase';
import { QrFormatComponent } from './components/qr-format/qr-format.component';

export const firebaseConfig = {
  apiKey: "AIzaSyBttNpuUeIIDyHVmlT23PGnS_94BH59qqk",
  authDomain: "afterschool-ed7d5.firebaseapp.com",
  databaseURL: "https://afterschool-ed7d5.firebaseio.com",
  projectId: "afterschool-ed7d5",
  storageBucket: "afterschool-ed7d5.appspot.com",
  messagingSenderId: "783826058200"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    AsideComponent,
    AgentComponent,
    StatusComponent,
    SettingComponent,
    SortDataPipe,
    SearchTextPipe,
    PupilComponent,
    CodeComponent,
    PupilSearchPipe,
    PupilSortPipe,
    StatusSearchPipe,
    StatusSortPipe,
    QrFormatComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NKDatetimeModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
  ],
  providers: [
    DbService,
    AuthAdminGuard,
    AuthAccountGuard,
    DatabaseService,
    CommonService,
    SortDataPipe,
    SearchTextPipe,
    PupilSearchPipe,
    PupilSortPipe,
    StatusSearchPipe,
    StatusSortPipe,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
