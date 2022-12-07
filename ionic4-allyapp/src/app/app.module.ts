import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

// Interceptor
import { CommonHttpInterceptor } from './interceptor/common.interceptor';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { ScrollHideDirective } from './directives/scroll-hide.directive';

import { ChartsModule } from 'ng2-charts';
import { FirestoreService } from './services/firestore.service';
import { ShareDataService } from './services/share-data.service';
import { ApiService } from './services/api.service';
import { LoadingService } from './services/loading.service';
import { HelpersService } from './services/helpers.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FireStoreStoreageService } from './services/firestore-storage.service';
import { ObjectiveService } from './services/objective.service';

@NgModule({
  declarations: [
    AppComponent,
    // ScrollHideDirective,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot({
      mode: 'ios',
    }),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    AngularFireAuth,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: CommonHttpInterceptor,
    },
    FirestoreService,
    ApiService,
    ShareDataService,
    AuthService,
    LoadingService,
    HelpersService,
    GooglePlus,
    FireStoreStoreageService,
    ObjectiveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
