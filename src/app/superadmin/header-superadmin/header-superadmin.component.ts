import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-superadmin',
  templateUrl: './header-superadmin.component.html',
  styleUrls: ['./header-superadmin.component.css'],
})
export class HeaderSuperadminComponent implements OnInit {
  currentUser: any;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.getcurrentuser().subscribe({
      next: (response:any) => {
        this.currentUser = response.user; // depends on your API shape
        console.log('Current User:', this.currentUser);
      },
      error: (err:any) => {
        console.error('Error fetching current user', err);
      },
    });
  }

  logout() {
    this.auth.logout(); // ton service logout
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // recharge la page après la navigation
    });
  }

  toggleSidebar(): void {
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.toggle('mini-sidebar');
    }
  }

  toggleMobileMenu(): void {
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.toggle('slide-nav');
    }
  }
}
