import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardSuperadminComponent } from './superadmin/dashboard-superadmin/dashboard-superadmin.component';
import { SuperadminGuard } from './guards/superadmin.guard';
import { CompaniesComponent } from './superadmin/companies/index/companies.component';
import { AddCompanieComponent } from './superadmin/companies/add-companie/add-companie.component';
import { CompanieDetailsComponent } from './superadmin/companies/companie-details/companie-details.component';
import { CategoriesComponent } from './superadmin/categories/categories.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {path:'login',component:LoginComponent},
  {path: 'admin',component:AdminComponent},

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
