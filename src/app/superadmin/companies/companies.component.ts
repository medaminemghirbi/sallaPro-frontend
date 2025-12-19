import { Component, OnInit } from '@angular/core';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  companies: any;
  companyTypes: any;
  searchTerm: string = '';
  pageSize: number = 10;
  p: number = 1;
  loading: boolean = false;
  isLoading = false;

  companyForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private superadminService: SuperadminService
  ) {}
  ngOnInit(): void {
    this.companyForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        company_name: ['', Validators.required],
        company_type_id: ['', Validators.required],
        billing_address: [''],
        description: [''],
      },
      { validators: this.passwordMatchValidator }
    );
    this.loadCompanies();
    this.loadCompanyTypes();
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value ===
      form.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }
  async loadCompanyTypes() {
    this.loading = true; // start loading
    try {
      this.companyTypes = await firstValueFrom(
        this.superadminService.company_types()
      );
    } catch (err) {
      console.error('Failed to load company types', err);
    } finally {
      this.loading = false; // stop loading
    }
  }

  async loadCompanies() {
    this.loading = true;
    try {
      this.companies = await firstValueFrom(this.superadminService.companies());
    } catch (err) {
      console.error('Failed to load companies', err);
    } finally {
      this.loading = false;
    }
  }

  get filteredCompanies() {
    if (!this.companies) return [];
    return this.companies.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.company_type?.name
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        c.admin?.firstname
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        c.admin?.lastname
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        c.address?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSubmit() {
    if (this.companyForm.invalid) return;
    this.isLoading = true;

    this.superadminService
      .createCompanyWithAdmin(this.companyForm.value)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          // Close modal and refresh table
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }
}
