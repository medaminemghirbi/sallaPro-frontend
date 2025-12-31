import { Component, OnInit } from '@angular/core';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  companies: any;
  searchTerm: string = '';
  pageSize: number = 10;
  p: number = 1;
  loading: boolean = false;
  isLoading = false;
  sendingEmail = false;

  constructor(
    private fb: FormBuilder,
    private superadminService: SuperadminService,
    private translate: TranslateService,
    private auth: SuperadminService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadCompanies();
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value ===
      form.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
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

  goToCompanyDetails(companyId: string) {
    this.router.navigate(
      ['/superadmin/companies', companyId, 'company-details'],
      { queryParams: { edit: true } } // add query param
    );
  }

  resendConfirmationEmail(adminId: number) {
    if (this.sendingEmail) return;

    this.sendingEmail = true;

    this.auth.resendConfirmationEmail(adminId).subscribe(
      () => {
        Swal.fire(
          this.translate.instant('SUCCESS.TITLE'),
          this.translate.instant('COMPANY.ADMIN.CONFIRMATION_SENT'),
          'success'
        );
        this.sendingEmail = false;
      },
      () => {
        Swal.fire(
          this.translate.instant('ERROR.TITLE'),
          this.translate.instant('COMPANY.ADMIN.CONFIRMATION_FAILED'),
          'error'
        );
        this.sendingEmail = false;
      }
    );
  }
}
