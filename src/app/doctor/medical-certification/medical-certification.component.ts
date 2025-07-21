import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertifcatesService } from 'src/app/services/certifcates.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
 docDefinition:any
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
        this.isLoading = false;
      },
      error => {
        console.error('Error loading certificate:', error);
        this.isLoading = false;
      }
    );
  }

  getEndDate(): Date {
    if (!this.certificateData?.consultation?.date) return new Date();
    const startDate = new Date(this.certificateData.consultation.date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + this.durationDays);
    return endDate;
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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
    };
    reader.readAsDataURL(this.image);
  }

  // New: Generate PDF dynamically with pdfMake
  generatePdf() {
    if (!this.certificateData) return;

    const d = this.certificateData;

    // Map phone numbers to string like "home: (216) 581 5197"
    const phoneNumbersFormatted = (d.doctor.phone_numbers || [])
      .map((p: any) => `${p.phone_type}: ${p.number}`)
      .join(', ');

    this.docDefinition = {
      content: [
        { text: "CERTIFICAT MÉDICAL D'ABSENCE", style: 'header', alignment: 'center', tocItem: false },
        { text: '\n', tocItem: false },
        { text: `Je soussigné Dr. ${d.doctor.firstname} ${d.doctor.lastname}`, style: 'subheader', tocItem: false },
        { text: `Certifie que l'examen médical du patient ${d.patient.firstname} ${d.patient.lastname}, âgé de ${d.patient.age || 'N/A'} ans,`, tocItem: false },
        { text: `résidant à ${d.patient.address || 'N/A'}, a nécessité un arrêt de travail.`, tocItem: false },
        { text: '\n', tocItem: false },
        { text: "Durée d'arrêt:", bold: true, tocItem: false },
        { text: `De ${new Date(d.consultation.date).toLocaleDateString()} au ${this.getEndDate().toLocaleDateString()}`, tocItem: false },
        { text: '\n', tocItem: false },
        { text: `Consultation réalisée le: ${new Date(d.consultation.date).toLocaleDateString()}`, italics: true, tocItem: false },
        { text: `Certificat généré le: ${new Date().toLocaleString()}`, italics: true, tocItem: false },
        { text: '\n', tocItem: false },
        { text: 'Signature:', margin: [0, 50, 0, 0], tocItem: false },
        { text: `Dr. ${d.doctor.firstname} ${d.doctor.lastname}`, bold: true, tocItem: false },
        { text: '\n', tocItem: false },
        {
          columns: [
            { width: 'auto', text: 'Contact:', bold: true, tocItem: false },
            { width: '*', text: `${phoneNumbersFormatted} - ${d.doctor.email || ''}`, tocItem: false }
          ],
          tocItem: false
        },
        { text: '\n', tocItem: false },
        { text: 'Réseaux sociaux:', bold: true, tocItem: false },
        {
          ul: [
            `Site web: ${d.doctor.website || 'N/A'}`,
            `Twitter: ${d.doctor.twitter || 'N/A'}`,
            `YouTube: ${d.doctor.youtube || 'N/A'}`,
            `Facebook: ${d.doctor.facebook || 'N/A'}`,
            `LinkedIn: ${d.doctor.linkedin || 'N/A'}`
          ],
          tocItem: false
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
      },
      defaultStyle: { fontSize: 12 }
    };

    pdfMake.createPdf(this.docDefinition).open();
  }


}
