import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css']
})
export class PatientHeaderComponent implements OnInit {
  currentuser : any
  constructor(private auth : AuthService) { }
  qr_url!:string;
  ngOnInit(): void {
    this.currentuser = this.auth.getcurrentuser();
    this.qr_url = sessionStorage.getItem('qr_url')!;
    console.log(this.qr_url)
  }

}
