import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ToastrModule } from 'ngx-toastr';
import { FirstKeyValuePipe } from './first-key-value.pipe';
import { FilterByStatusPipe } from './filter-by-status.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxLoadersCssModule } from 'ngx-loaders-css';
import { NgxEditorModule } from 'ngx-editor';
import { FilterByVerificationPipe } from './filter-by-verification.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { LoginComponent } from './login/login.component';
import { DashboardSuperadminComponent } from './superadmin/dashboard-superadmin/dashboard-superadmin.component';
import { HeaderSuperadminComponent } from './superadmin/header-superadmin/header-superadmin.component';
import { SidebarSuperadminComponent } from './superadmin/sidebar-superadmin/sidebar-superadmin.component';
import { CategoriesComponent } from './superadmin/categories/categories.component';
import { CompaniesComponent } from './superadmin/companies/index/companies.component';
import { AddCompanieComponent } from './superadmin/companies/add-companie/add-companie.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanieDetailsComponent } from './superadmin/companies/companie-details/companie-details.component';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/dashboard-admin/admin.component';
import { SidebarAdminComponent } from './admin/sidebar-admin/sidebar-admin.component';
import { IndexComponent } from './admin/client/index/index.component';
import { AddClientComponent } from './admin/client/add-client/add-client.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    FirstKeyValuePipe,
    FilterByStatusPipe,
    FilterByVerificationPipe,
    SafeUrlPipe,
    AdminComponent,
    LoginComponent,
    DashboardSuperadminComponent,
    HeaderSuperadminComponent,
    HeaderAdminComponent,
    SidebarSuperadminComponent,
    CategoriesComponent,
    CompaniesComponent,
    AddCompanieComponent,
    CompanieDetailsComponent,
    CalendarComponent,
    SidebarAdminComponent,
    IndexComponent,
    AddClientComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgProgressModule,
    NgxLoadersCssModule,
    NgxEditorModule,
    NgProgressModule.withConfig({
      color: '#0dd9f9',
    }),
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgProgressHttpModule,
    ReactiveFormsModule,
    FullCalendarModule,
    NgSelectModule,
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
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
