import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-superadmin',
  templateUrl: './dashboard-superadmin.component.html',
  styleUrls: ['./dashboard-superadmin.component.css'],
})
export class DashboardSuperadminComponent implements OnInit {
  currentUser: any;

  constructor(
    private translate: TranslateService,
    private auth: AuthService,
    private usersService: AdminService
  ) {}

  ngOnInit(): void {
    this.auth.getcurrentuser().subscribe({
      next: (response:any) => {
        this.currentUser = response.user; // depends on your API shape
        
      },
      error: (err:any) => {
        console.error('Error fetching current user', err);
      },
    });
  }
}
