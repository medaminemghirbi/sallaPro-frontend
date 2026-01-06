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

  /**
   * Export clients to specified format
   * @param format - Export format: 'csv', 'pdf', or 'json'
   * @param clientIds - Optional array of client IDs to export (if empty, exports all)
   * @param filters - Optional filters to apply (search, resourceType, etc.)
   * @returns Observable with blob data or download URL
   */
  exportClients(format: 'csv' | 'pdf' | 'json' | 'world', clientIds?: any[], filters?: any) {
    const payload = {
      format,
      clientIds: clientIds || [],
      filters: filters || {}
    };
    
    return this.http.post(
      `${environment.urlBackend}api/v1/clients/export`,
      payload,
      { 
        responseType: 'blob',
        observe: 'response'
      }
    );
  }

  /**
   * Update client information
   * @param id - Client ID
   * @param data - Updated client data (address, phone_number)
   * @returns Observable
   */
  updateClient(id: any, data: any) {
    return this.http.put(
      `${environment.urlBackend}api/v1/clients/${id}`,
      data
    );
  }

  /**
   * Delete a client by ID
   * @param id - Client ID
   * @returns Observable
   */
  deleteClient(id: any) {
    return this.http.delete(
      `${environment.urlBackend}api/v1/clients/${id}`
    );
  }
}
