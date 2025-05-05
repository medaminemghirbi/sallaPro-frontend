import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertifcatesService {

  constructor(private http: HttpClient) { }

  getCertificate(consultationId: number): Observable<any> {
    return this.http.get(`${environment.urlBackend}api/v1/certificates/${consultationId}.json`);
  }

  downloadCertificate(consultationId: number): Observable<Blob> {
    return this.http.get(`${environment.urlBackend}api/v1/certificates/${consultationId}.pdf`, {
      responseType: 'blob'
    });
  }

}
