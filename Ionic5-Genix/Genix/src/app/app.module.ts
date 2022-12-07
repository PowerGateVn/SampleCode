import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormioModule, FormioAppConfig } from 'angular-formio';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormioAuthService, FormioAuthConfig } from 'angular-formio/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage';
import { HttpInterceptProviders } from './helpers/auth.interceptor';
import { HttpErrorInterceptProviders } from './helpers/error.interceptor';

import { AppConfig } from '../config';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormioModule,
        // MatFormioModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        BrowserAnimationsModule,
        IonicStorageModule.forRoot(),
        HttpClientModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FormioAppConfig, useValue: AppConfig },
        FormioAuthService,
        {
            provide: FormioAuthConfig,
            useValue: {
                login: {
                    form: 'user/login'
                },
                register: {
                    form: 'user/register'
                }
            }
        },
        HttpInterceptProviders,
        HttpErrorInterceptProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
