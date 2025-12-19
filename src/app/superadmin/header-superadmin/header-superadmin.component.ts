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
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('mini-sidebar')) {
      body.classList.remove('mini-sidebar');
    } else {
      body.classList.add('mini-sidebar');
    }
  }

  toggleMobileMenu(): void {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('slide-nav')) {
      body.classList.remove('slide-nav');
    } else {
      body.classList.add('slide-nav');
    }
  }

}
