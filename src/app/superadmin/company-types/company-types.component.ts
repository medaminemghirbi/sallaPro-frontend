import { Component, OnInit } from '@angular/core';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-company-types',
  templateUrl: './company-types.component.html',
  styleUrls: ['./company-types.component.css']
})
export class CompanyTypesComponent implements OnInit {
  company_types: any
  searchTerm: string = '';
  pageSize: number = 10;
  p: number = 1;
  loading: boolean = false; // ✅ track loading

  constructor(private superadminservice: SuperadminService) {}

  ngOnInit(): void {
    this.loadCompanyTypes();
  }

  async loadCompanyTypes() {
    this.loading = true; // start loading
    try {
      this.company_types = await firstValueFrom(
        this.superadminservice.company_types()
      );
    } catch (err) {
      console.error('Failed to load company types', err);
    } finally {
      this.loading = false; // stop loading
    }
  }

  // Filtered data for search
  get filteredCompanyTypes() {
    if (!this.company_types) return [];
    return this.company_types.filter((c: any) =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
