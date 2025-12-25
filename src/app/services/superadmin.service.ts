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

  categories() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/categories/');
  }
  companies() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/companies/');
  }
  companieDetails(id: any) {
    return this.http.get(
      `${environment.urlBackend}` + `api/v1/companies/${id}/`
    );
  }
  createCompanyWithAdmin(data: any) {
    return this.http.post(
      `${environment.urlBackend}` + 'api/v1/companies/',
      data
    );
  }

  updateCompany(id: any, data: any) {
    return this.http.put(
      `${environment.urlBackend}` + `api/v1/companies/${id}/`,
      data
    );
  }
  
}
