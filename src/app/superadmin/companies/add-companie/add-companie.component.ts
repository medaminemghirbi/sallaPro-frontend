import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-companie',
  templateUrl: './add-companie.component.html',
  styleUrl: './add-companie.component.css',
})
export class AddCompanieComponent implements OnInit {
  companyForm!: FormGroup;
  companyTypes: any[] = [];
  filteredCompanyTypes: any[] = [];
  isLoading = false;
  loading = false;
  searchTerm = '';
  selectedCompanyType: any = null;
  showCompanyTypeDropdown = false;

  constructor(
    private fb: FormBuilder,
    private superadminService: SuperadminService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanyTypes();
    this.companyForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        company_name: ['', Validators.required],
        billing_address: [''],
        description: [''],
        categorie_id: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  async loadCompanyTypes() {
    this.loading = true;
    try {
      this.companyTypes = (await firstValueFrom(
        this.superadminService.categories()
      )) as any[];
      this.filteredCompanyTypes = this.companyTypes;
    } catch (err) {
      console.error('Failed to load company types', err);
      this.toastr.error('Failed to load company types');
    } finally {
      this.loading = false;
    }
  }

  filterCompanyTypes() {
    if (!this.searchTerm) {
      this.filteredCompanyTypes = this.companyTypes;
    } else {
      this.filteredCompanyTypes = this.companyTypes.filter((type: any) =>
        type.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectCompanyType(type: any) {
    this.selectedCompanyType = type;
    this.companyForm.get('company_type_id')?.setValue(type.id);
    this.showCompanyTypeDropdown = false;
    this.searchTerm = '';
  }

  clearCompanyType() {
    this.selectedCompanyType = null;
    this.companyForm.get('company_type_id')?.setValue('');
    this.searchTerm = '';
    this.filteredCompanyTypes = this.companyTypes;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value ===
      form.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.companyForm.invalid) return;

    this.isLoading = true;

    this.superadminService
      .createCompanyWithAdmin(this.companyForm.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.route.navigate(['/superadmin/companies']);
          this.toastr.success('Company created successfully');
        },
        error: (err) => {
          this.isLoading = false;

          const message = err?.error?.errors || 'Something went wrong';

          this.toastr.error(message);
        },
      });
  }
}
