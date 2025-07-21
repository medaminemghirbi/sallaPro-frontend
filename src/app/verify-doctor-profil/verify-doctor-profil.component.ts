import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-doctor-profil',
  templateUrl: './verify-doctor-profil.component.html'
})
export class VerifyDoctorProfilComponent {
  selectedFile: File | null = null;
  loading = false;
  message = '';
  success = false;
  redirectMessage = false;
  doctordata: any;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
    this.doctordata = JSON.parse(sessionStorage.getItem('doctordata')!);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = '';
      this.redirectMessage = false;  // Reset redirect message if selecting new file
    }
  }

  uploadPdf(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('verification_pdf', this.selectedFile);
    formData.append('id', this.doctordata.id);

    this.loading = true;
    this.message = '';
    this.http.patch(environment.urlBackend + 'api/v1/upload_verification_pdf/', formData)
      .subscribe({
        next: () => {
          this.message = 'Document uploaded successfully!';
          this.success = true;
          this.loading = false;

          this.redirectMessage = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.message = 'Upload failed. Please try again.';
          this.success = false;
          this.loading = false;
          this.redirectMessage = false;
        }
      });
  }

  get pendingVerification(): boolean {
    return this.doctordata && !this.doctordata.is_verified && this.doctordata.verification_pdf_url;
  }

    logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
