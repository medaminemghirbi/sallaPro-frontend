import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent implements OnInit {
  currentCompany:any
  constructor(
    private auth: AuthService,
  ) { }
  ngOnInit(): void {
    this.auth.getcurrentcompany().subscribe({
      next: (response: any) => {
        this.currentCompany = response.company; // your API shape
        console.log('Current Company:', this.currentCompany);

      },
      error: (err: any) => {
        console.error('Error fetching current user', err);
        // fallback to default language if API fails
      },
    });
  }

}
  