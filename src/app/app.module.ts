import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app/app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule } from "./application/authentication/auth.module";
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { SharedModule } from "./shared/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Interceptor } from "./core/interceptor/interceptor";
import { AuthService } from "./core/services/auth.service";
import { UtilService } from "./core/services/util.service";
import { TotalVisitListComponent } from './application/dashboard/visitor-list/total-visit-list/total-visit-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
// material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment';

import { AuthGuard } from './app.routing.guard';
import { LoginComponent } from "./application/authentication/login/login.component";
import { RouteReuseStrategy } from "@angular/router";

import { CacheRouteReuseStrategy } from "./cache-route-reuse.strategy";



@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, TotalVisitListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    SharedModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSlideToggleModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    AppRoutingModule,

  ],
  providers: [
    AuthService,
    AuthGuard,
    UtilService,
    {
      provide: RouteReuseStrategy,
      useClass: CacheRouteReuseStrategy
    },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
