import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from 'src/app/services/superadmin.service';

@Component({
  selector: 'app-companie-details',
  templateUrl: './companie-details.component.html',
  styleUrl: './companie-details.component.css',
})
export class CompanieDetailsComponent implements OnInit, OnDestroy {
  companyId!: number;
  company: any;
  loading = false;
  saving = false;
  editMode = false;
  companyForm!: FormGroup;
  companyTypes: any[] = [];
  selectedLogoFile: any;

  trialDays = 14;
  daysLeft = 0;
  hoursLeft = 0;
  minutesLeft = 0;
  secondsLeft = 0;
  progress = 0;
  showTrialBar = true;
  private timer: any;
  private endDate!: Date;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private superadminService: SuperadminService
  ) {}

  ngOnInit(): void {
    // ✅ get id from URL
    this.companyId = this.route.snapshot.params['id'];

    this.buildForm();
    this.loadCompany();

    const editModeParam = this.route.snapshot.queryParamMap.get('edit');
    if (editModeParam === 'true') {
      this.enableEdit(); // enable edit mode directly
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  buildForm() {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      phone_number: [''],
      billing_address: [''],
      description: [''],
    });
    this.companyForm.disable();
  }
  loadCompany() {
    this.loading = true;

    this.superadminService.companieDetails(this.companyId).subscribe({
      next: (res) => {
        this.company = res;
        this.patchFormFromCompany();

        // ✅ subscription is an OBJECT, not an array
        if (this.company?.subscription) {
          this.endDate = new Date(this.company.subscription.end_date);

          this.updateCountdown();
          this.timer = setInterval(() => this.updateCountdown(), 1000);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  get subscriptionActive(): boolean {
    return !!this.company?.subscription_status;
  }
  patchFormFromCompany() {
    if (!this.company || !this.companyForm) return;
    this.companyForm.patchValue({
      name: this.company.name,
      phone_number: this.company.phone_number,
      billing_address: this.company.billing_address,
      company_image_url: this.company.company_image_url,
      description: this.company.description,
    });
  }
  enableEdit() {
    this.editMode = true;
    this.companyForm.enable();
  }
  cancelEdit() {
    this.editMode = false;
    this.patchFormFromCompany();
    this.companyForm.disable();
  }
  onSave() {
    if (!this.editMode) return;
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = {
      name: this.companyForm.value.name,
      phone_number: this.companyForm.value.phone_number,
      billing_address: this.companyForm.value.billing_address,
      description: this.companyForm.value.description,
    };
    this.superadminService.updateCompany(this.companyId, payload).subscribe({
      next: (updated) => {
        this.company = updated;
        this.saving = false;
        this.editMode = false;
        this.patchFormFromCompany();
        this.companyForm.disable();
        this.toastr.success('Company updated successfully');
      },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.errors || 'Failed to update company';
        this.toastr.error(message);
      },
    });
  }
  private updateCountdown() {
    const now = new Date().getTime();
    const diff = this.endDate.getTime() - now;

    if (diff <= 0) {
      this.daysLeft = this.hoursLeft = this.minutesLeft = this.secondsLeft = 0;
      this.progress = 100;
      clearInterval(this.timer);
      return;
    }

    this.daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hoursLeft = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    this.minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

    const elapsedDays =
      this.trialDays -
      this.daysLeft -
      (this.hoursLeft > 0 || this.minutesLeft > 0 || this.secondsLeft > 0
        ? 0
        : 1);
    this.progress = Math.min(100, (elapsedDays / this.trialDays) * 100);
  }

  closeTrialBar() {
    this.showTrialBar = false;
  }

  cancelSubscription() {
    // this.superadminService.cancelSubscription(this.company.subscription.id)
    //   .subscribe(() => {
    //     this.company.subscription.active = false;
    //     this.company.subscription.status = 'cancelled';
    //   });
    console.log('Cancel subscription clicked');
  }

  get subscriptionPlan(): string | null {
    return this.company?.subscription?.plan ?? null;
  }

  get showSubscriptionBar(): boolean {
    return (
      this.subscriptionPlan === 'trial' || this.subscriptionPlan === 'monthly'
    );
  }

  get subscriptionBarClass(): string {
    switch (this.subscriptionPlan) {
      case 'trial':
        return 'trial-bar-warning'; // jaune
      case 'monthly':
        return 'trial-bar-success'; // vert
      default:
        return '';
    }
  }

  get subscriptionLabel(): string {
    switch (this.subscriptionPlan) {
      case 'trial':
        return 'Trial Mode';
      case 'monthly':
        return 'Monthly Plan';
      default:
        return '';
    }
  }
}
