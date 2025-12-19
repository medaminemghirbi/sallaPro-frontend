import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-superadmin',
  templateUrl: './header-superadmin.component.html',
  styleUrls: ['./header-superadmin.component.css']
})
export class HeaderSuperadminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
