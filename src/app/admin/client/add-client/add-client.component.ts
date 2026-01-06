import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css',
})
export class AddClientComponent implements OnInit {
  clientForm!: FormGroup;
  isLoading = false;
  addressOption = 'manual'; // default
  center = { lat: 36.8, lng: 10.2 }; // par défaut sur Sousse par ex.
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral | null = null;
  addressFromMap = '';

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
        country: [''],
        latitude: [''],
        longitude: [''],
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

    this.adminService.createClient(this.clientForm.value).subscribe({
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

  mapClicked(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // Set latitude and longitude to form
      this.clientForm.get('latitude')?.setValue(this.markerPosition.lat);
      this.clientForm.get('longitude')?.setValue(this.markerPosition.lng);

      // Optionnel: utiliser Geocoder pour convertir en adresse lisible
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: this.markerPosition }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          this.addressFromMap = results[0].formatted_address;
          this.clientForm.get('address')?.setValue(this.addressFromMap);
          
          // Extract country from address components
          const country = this.extractCountry(results[0].address_components);
          if (country) {
            this.clientForm.get('country')?.setValue(country);
          }
        }
      });
    }
  }

  onLocationSelected(location: { lat: number; lng: number; address: string }) {
    this.markerPosition = { lat: location.lat, lng: location.lng };
    this.addressFromMap = location.address;
    this.clientForm.get('address')?.setValue(this.addressFromMap);
    
    // Set latitude and longitude to form
    this.clientForm.get('latitude')?.setValue(location.lat);
    this.clientForm.get('longitude')?.setValue(location.lng);
    
    // Reverse geocode to get country
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: this.markerPosition }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const country = this.extractCountry(results[0].address_components);
        if (country) {
          this.clientForm.get('country')?.setValue(country);
        }
      }
    });
  }

  /**
   * Extract country name from Google Maps address components
   * @param components - Array of address components from geocoding result
   * @returns Country name or empty string
   */
  private extractCountry(components: google.maps.GeocoderAddressComponent[]): string {
    const countryComponent = components.find(component =>
      component.types.includes('country')
    );
    return countryComponent ? countryComponent.long_name : '';
  }
}
