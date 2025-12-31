import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.urlBackend + 'api/v1/blogs/';
  private apiUrlall = environment.urlBackend + 'api/v1/all_all_verification/';

  
  constructor(private http: HttpClient, public router: Router) {}

  /////////////////////// Clients  */////////////////
  clients(){
    return this.http.get<any>(environment.urlBackend + 'api/v1/clients');
  }
    getDefaultLanguage(id: any) {
    return this.http.get(environment.urlBackend + 'api/v1/get_defaut_language/' + id);
  }

    createClient(data: any) {
    return this.http.post(
      `${environment.urlBackend}` + 'api/v1/clients/',
      data
    );
  }
}
