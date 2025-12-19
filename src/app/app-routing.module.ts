import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardSuperadminComponent } from './superadmin/dashboard-superadmin/dashboard-superadmin.component';
import { SuperadminGuard } from './guards/superadmin.guard';

const routes: Routes = [
  { path: '', component: IndexComponent },
  {path:'login',component:LoginComponent},
  {path: 'admin',component:AdminComponent},

  ///***Superadmin */
  { path: 'superadmin/dashboard', canActivate: [SuperadminGuard], component: DashboardSuperadminComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
