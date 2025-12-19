import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuperadminService {
  private apiUrl = environment.urlBackend + 'api/v1/blogs/';
  private apiUrlall = environment.urlBackend + 'api/v1/all_all_verification/';

  constructor(private http: HttpClient, public router: Router) {}

  company_types() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/company_types/');
  }
  companies() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/companies/');
  }
  createCompanyWithAdmin(data: any) {
    return this.http.post(
      `${environment.urlBackend}` + 'api/v1/companies/',
      data
    );
  }
}
