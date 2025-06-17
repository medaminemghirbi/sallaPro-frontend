import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-header',
  templateUrl: './doctor-header.component.html',
  styleUrls: ['./doctor-header.component.css']
})
export class DoctorHeaderComponent implements OnInit {
  currentuser : any
  constructor(private auth : AuthService) { }
  qr_url!:string;
  ngOnInit(): void {
    this.currentuser = this.auth.getcurrentuser();
    this.qr_url = sessionStorage.getItem('qr_url')!;
    console.log(this.qr_url)
  }

}
