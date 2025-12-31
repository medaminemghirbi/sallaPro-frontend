import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css'
})
export class AddClientComponent implements OnInit {
  clientForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        birthday: [''],
        phone_number: [''],
        address: [''],
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
    if (this.clientForm.invalid) return;

    this.isLoading = true;

    this.adminService
      .createClient(this.clientForm.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.route.navigate(['/admin/clients']);
          this.toastr.success('Client created successfully');
        },
        error: (err) => {
          this.isLoading = false;

          const message = err?.error?.errors || 'Something went wrong';

          this.toastr.error(message);
        },
      });
  }
}
