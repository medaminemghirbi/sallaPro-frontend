import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardSuperadminComponent } from './superadmin/dashboard-superadmin/dashboard-superadmin.component';
import { SuperadminGuard } from './guards/superadmin.guard';
import { CompaniesComponent } from './superadmin/companies/index/companies.component';
import { AddCompanieComponent } from './superadmin/companies/add-companie/add-companie.component';
import { CompanieDetailsComponent } from './superadmin/companies/companie-details/companie-details.component';
import { CategoriesComponent } from './superadmin/categories/categories.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/dashboard-admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { IndexComponent } from './admin/client/index/index.component';
import { AddClientComponent } from './admin/client/add-client/add-client.component';
import { AdminSettingsComponent } from './admin/settings/admin-settings.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {path:'login',component:LoginComponent},
  {path: 'admin/dashboard',component:AdminComponent},
  {path:'admin/calendar',component:CalendarComponent, canActivate:[AdminGuard]},
  {path:'admin/clients', component: IndexComponent, canActivate:[AdminGuard]},
  {path:'admin/clients/add-client', component: AddClientComponent, canActivate:[AdminGuard]},
  {path:'admin/settings', component: AdminSettingsComponent, canActivate:[AdminGuard]},
  ///***Superadmin */
  { path: 'superadmin/dashboard', canActivate: [SuperadminGuard], component: DashboardSuperadminComponent },
  {path: 'superadmin/companies',component:CompaniesComponent, canActivate: [SuperadminGuard]},
  {path: 'superadmin/companies/add-new-company',component:AddCompanieComponent, canActivate: [SuperadminGuard]},
  {path: 'superadmin/companies/:id/company-details',component:CompanieDetailsComponent, canActivate: [SuperadminGuard]},

  {path:'superadmin/categories', canActivate: [SuperadminGuard], component: CategoriesComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
