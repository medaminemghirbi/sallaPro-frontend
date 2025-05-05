import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertifcatesService } from 'src/app/services/certifcates.service';

@Component({
  selector: 'app-medical-certification',
  templateUrl: './medical-certification.component.html',
  styleUrls: ['./medical-certification.component.css']
})
export class MedicalCertificationComponent implements OnInit {
  consultationId!: number;
  isLoading = true;
  certificateData: any;
  durationDays: number = 1; 
  image: any;
  imageupdate!: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private certificateService: CertifcatesService

  ) { }

  ngOnInit(): void {
    this.consultationId = this.activatedRoute.snapshot.params['consultationId'];

    this.loadCertificate();
  }

  loadCertificate(): void {
    this.isLoading = true;
    this.certificateService.getCertificate(this.consultationId).subscribe(
      data => {
        this.certificateData = data;
        console.error('certificate:', data);

        this.isLoading = false;
      },
      error => {
        console.error('Error loading certificate:', error);
        this.isLoading = false;
      }
    );
  }

  downloadCertificate(): void {
    this.certificateService.downloadCertificate(this.consultationId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical_certificate_${this.consultationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error => {
        console.error('Error downloading certificate:', error);
      }
    );
  }
  fileChange(event: any) {
    this.image = event.target.files[0];
    debugger;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
    };
    reader.readAsDataURL(this.image);
  }


  getEndDate(): Date {
    if (!this.certificateData?.consultation?.date) return new Date();
    const startDate = new Date(this.certificateData.consultation.date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + this.durationDays);
    return endDate;
  }

}