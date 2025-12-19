import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardSuperadminComponent } from './superadmin/dashboard-superadmin/dashboard-superadmin.component';
import { SuperadminGuard } from './guards/superadmin.guard';
import { CompanyTypesComponent } from './superadmin/company-types/company-types.component';
import { CompaniesComponent } from './superadmin/companies/companies.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {path:'login',component:LoginComponent},
  {path: 'admin',component:AdminComponent},

  ///***Superadmin */
  { path: 'superadmin/dashboard', canActivate: [SuperadminGuard], component: DashboardSuperadminComponent },
  {path: 'superadmin/companies',component:CompaniesComponent, canActivate: [SuperadminGuard]},
  {path:'superadmin/company-types', canActivate: [SuperadminGuard], component: CompanyTypesComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
