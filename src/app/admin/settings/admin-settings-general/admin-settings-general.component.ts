import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-admin-settings-general',
  templateUrl: './admin-settings-general.component.html',
  styleUrls: ['./admin-settings-general.component.css'],
})
export class AdminSettingsGeneralComponent implements OnInit, OnChanges {
  @Input() currentCompany: any;
  @Output() companyInfoUpdated = new EventEmitter<any>();

  companyForm = {
    companyName: '',
    billingAddress: '',
    address: '',
    categories: '',
    logo: ''
  };

  logoPreview: string = '';
  logoFile: File | null = null;

  constructor() {}

  ngOnInit(): void {
    this.updateFormFromCompany();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentCompany']) {
      this.updateFormFromCompany();
    }
  }

  private updateFormFromCompany(): void {
    if (this.currentCompany && Object.keys(this.currentCompany).length > 0) {
      this.companyForm = {
        companyName: this.currentCompany.company_name || this.currentCompany.name || '',
        billingAddress: this.currentCompany.billing_address || '',
        address: this.currentCompany.address || '',
        categories: this.currentCompany.categorie.name || '',
        logo: this.currentCompany.logo || this.currentCompany.logo_url || ''
      };
      this.logoPreview = this.currentCompany.logo || this.currentCompany.logo_url || '';
    } else {
      console.warn('Current company is empty or undefined');
    }
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.logoPreview = '';
    this.logoFile = null;
    this.companyForm.logo = '';
  }

  saveCompanyInfo(): void {
    const formData = new FormData();
    formData.append('company_name', this.companyForm.companyName);
    formData.append('billing_address', this.companyForm.billingAddress);
    formData.append('address', this.companyForm.address);
    
    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }

    this.companyInfoUpdated.emit(formData);
  }
}
