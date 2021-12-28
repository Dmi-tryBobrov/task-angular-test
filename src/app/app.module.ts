import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockServerInterceptor } from './interceptors/mock-server.interceptor';
import { GraphDataStore } from './store/graph-data.store';
import { IsNumberDirective } from './validators/is-number.directive';
import { SameValueDirective } from './validators/same-value.directive';
import { ShowSpinnerInterceptor } from './interceptors/show-spinner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    NavigationBarComponent,
    IsNumberDirective,
    SameValueDirective,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ShowSpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: MockServerInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
