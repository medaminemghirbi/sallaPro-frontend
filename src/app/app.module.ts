import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { FullCalendarModule } from '@fullcalendar/angular';
import { ToastrModule } from 'ngx-toastr';
import { FirstKeyValuePipe } from './first-key-value.pipe';
import { FilterByStatusPipe } from './filter-by-status.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxLoadersCssModule } from 'ngx-loaders-css';
import { NgxEditorModule } from 'ngx-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterByVerificationPipe } from './filter-by-verification.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardSuperadminComponent } from './superadmin/dashboard-superadmin/dashboard-superadmin.component';
import { HeaderSuperadminComponent } from './superadmin/header-superadmin/header-superadmin.component';
import { SidebarSuperadminComponent } from './superadmin/sidebar-superadmin/sidebar-superadmin.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,

    FirstKeyValuePipe,
    FilterByStatusPipe,
    FilterByVerificationPipe,
    SafeUrlPipe,
    AdminComponent,
    LoginComponent,
    DashboardSuperadminComponent,
    HeaderSuperadminComponent,
    SidebarSuperadminComponent

    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgProgressModule,
    FullCalendarModule,
    NgxLoadersCssModule,
    NgxEditorModule,
    NgSelectModule,
    NgProgressModule.withConfig({
      color: "#003d99"
    }),
    ToastrModule.forRoot({ // ToastrModule added
      timeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgProgressHttpModule,
    ReactiveFormsModule,
    FullCalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
