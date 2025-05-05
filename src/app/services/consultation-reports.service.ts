import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultationReportsService {

  constructor(private http: HttpClient) { }

  getConsultationReport(consultationId: string) {
    return this.http.get<any[]>(environment.urlBackend+`api/v1/consultations/${consultationId}/consultation_report`);
  }

  createConsultationReport(consultationId: string, reportData: any) {
    return this.http.post(environment.urlBackend+`api/v1/consultations/${consultationId}/consultation_report`, reportData);
  }

  downloadReportPdf(consultationId: string) {
    return this.http.get(environment.urlBackend+`api/v1/consultations/${consultationId}/report/download`, { responseType: 'blob' });
  }
  visualiseReportPdf(consultationId: string) {
    return this.http.get(environment.urlBackend+`api/v1/consultations/${consultationId}/report/visualise`, { responseType: 'blob' });
  }
}
