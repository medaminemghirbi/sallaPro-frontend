import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  favoriteDoctor: any[] = [];
  loading = true;
  currentuser:any
  constructor() {
  }

ngOnInit() {
  const stored = localStorage.getItem('favoriteDoctor');
  console.log(stored)
  if (stored) {
    this.favoriteDoctor = JSON.parse(stored);
  }
}
}
