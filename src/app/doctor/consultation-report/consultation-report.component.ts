import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultationReportsService } from 'src/app/services/consultation-reports.service';

@Component({
  selector: 'app-consultation-report',
  templateUrl: './consultation-report.component.html',
  styleUrls: ['./consultation-report.component.css']
})
export class ConsultationReportComponent implements OnInit {
  report = {
    diagnosis: '',
    procedures: '',
    prescription: '',
    doctor_notes: '',
    images: [] as File[]
  };
  hasReport: boolean = false; // default
  consultationId: string = ''; // Variable to hold consultationId
  isLoading: boolean = false; // Track loading state
  patientDetails : any;
  constructor(
    private apiService: ConsultationReportsService,
    private activatedRoute: ActivatedRoute // Inject ActivatedRoute to access route parameters
  ) { }

  ngOnInit(): void {
    // Retrieve consultationId from route parameters
    this.consultationId = this.activatedRoute.snapshot.params['consultationId'];
    if (this.consultationId) {
      console.log(this.consultationId)

      this.checkReportExists();
    }
  }


  // Check if the report exists for the given consultationId
  checkReportExists() {
    this.isLoading = true;
    this.apiService.getConsultationReport(this.consultationId).subscribe((res: any) => {
      this.patientDetails =res['patient']
      console.log(this.patientDetails)
      if (res?.reportExists) {
        this.hasReport = true;
      } else {
        this.hasReport = false;
      }
  
      this.isLoading = false;
    }, (error) => {
      console.error('Error checking report:', error);
      this.isLoading = false;
    });
  }
  

  // Submit the consultation report
  submitReport() {
    console.log('Submitting report:', this.report);
  
    this.isLoading = true;
  
    if (this.consultationId) {
      const formData = new FormData();
  
      // Append text fields
      formData.append('consultation_report[diagnosis]', this.report.diagnosis);
      formData.append('consultation_report[procedures]', this.report.procedures);
      formData.append('consultation_report[prescription]', this.report.prescription);
      formData.append('consultation_report[doctor_notes]', this.report.doctor_notes);
  
      // Append each image (assuming this.report.images is a File[] array)
      if (this.report.images && this.report.images.length > 0) {
        for (let i = 0; i < this.report.images.length; i++) {
          formData.append('consultation_report[images][]', this.report.images[i]);
        }
      }
  
      // Send the request
      this.apiService.createConsultationReport(this.consultationId, formData).subscribe(response => {
        console.log('Report submitted successfully:', response);
        this.isLoading = false;
      }, error => {
        console.error('Error submitting report:', error);
        this.isLoading = false;
      });
    }
  }
  
  // Handle file upload and store the files in the report object
  handleFileUpload(event: any) {
    this.report.images = Array.from(event.target.files);
  }

  // Download the report as a PDF
  downloadReport() {
    if (this.consultationId) {
      this.apiService.getConsultationReport(this.consultationId).subscribe((res: any) => {
        this.patientDetails =res['patient']
    });
      this.apiService.downloadReportPdf(this.consultationId).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `consultation Mr ${this.patientDetails.firstname} ${this.patientDetails.lastname}.pdf`;
        link.click();
      }, (error) => {
        console.error('Error downloading report:', error);
      });
    }
  }

  
}
