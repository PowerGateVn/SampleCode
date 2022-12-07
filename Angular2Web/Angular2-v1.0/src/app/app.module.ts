import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

// Services
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { HelperService } from './services/helper.service';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

// Components
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentComponent } from './components/content/content.component';

// Pipes
import { DataPipe } from './pipes/data.pipe';

// Directives
import { HighlightDirective } from './directives/highlight.directive';

// Guards
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthAccountGuard } from './guards/auth-account.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,
    ContentComponent,
    DataPipe,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    ApiService,
    AuthService,
    HelperService,
    DataPipe,
    AuthAdminGuard,
    AuthAccountGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
