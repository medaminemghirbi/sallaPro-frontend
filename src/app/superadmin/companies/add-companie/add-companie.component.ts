import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from 'src/app/services/superadmin.service';

@Component({
  selector: 'app-add-companie',
  templateUrl: './add-companie.component.html',
  styleUrl: './add-companie.component.css',
})
export class AddCompanieComponent implements OnInit {
  companyForm!: FormGroup;
  companyTypes: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private superadminService: SuperadminService,
    private toastr: ToastrService,
    private route: Router
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
        billing_address: [''],
        description: [''],
      },
      { validators: this.passwordMatchValidator }
    );

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
