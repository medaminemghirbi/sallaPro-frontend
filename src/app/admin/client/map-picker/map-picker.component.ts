import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.css'
})
export class MapPickerComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() selectionMode: boolean = false; // If true, emit location on selection
  @Output() locationSelected = new EventEmitter<{lat: number, lng: number, address: string}>();
  
  map!: google.maps.Map;
  latitude: number = 0;
  longitude: number = 0;
  marker!: google.maps.Marker;
  currenUser: any;
  update!: FormGroup;

  // Default location in Tunisia (center if no lat/long or address)
  defaultLocation = { lat: 35.829, lng: 10.641}; // Center of Tunisia

  constructor(private auth: AuthService, private userService: AdminService) {
    this.currenUser = this.auth.getcurrentuser();
    this.update = new FormGroup({
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Check if Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps) {
      this.loadMap();
    } else {
      // Wait for Google Maps to load
      this.waitForGoogleMaps();
    }
  }

  waitForGoogleMaps() {
    const checkInterval = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps) {
        clearInterval(checkInterval);
        this.loadMap();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      console.error('Google Maps API failed to load');
    }, 10000);
  }

  loadMap() {
    const geocoder = new google.maps.Geocoder();
    this.currenUser = this.auth.getcurrentuser();

    // Check if the currentUser has latitude/longitude
    if (this.currenUser.latitude && this.currenUser.longitude) {
      this.latitude = parseFloat(this.currenUser.latitude);
      this.longitude = parseFloat(this.currenUser.longitude);
    } else if (this.currenUser.address) {
      // If no lat/long, use the address to set the marker
      geocoder.geocode({ address: this.currenUser.address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const addressLatLng = results![0].geometry.location;
          this.latitude = addressLatLng.lat();
          this.longitude = addressLatLng.lng();
        } else {
          console.error('Geocode failed: ' + status);
          this.setDefaultMarker();
        }
        this.initMap(); // Initialize map after geocoding
      });
      return; // Exit since we're waiting on geocode
    } else if (this.currenUser.location) {
      // If no lat/long and no address, use the location (e.g., gouvernament of Tunisia)
      geocoder.geocode({ address: this.currenUser.location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const locationLatLng = results![0].geometry.location;
          this.latitude = locationLatLng.lat();
          this.longitude = locationLatLng.lng();
        } else {
          console.error('Geocode failed: ' + status);
          this.setDefaultMarker();
        }
        this.initMap(); // Initialize map after geocoding
      });
      return; // Exit since we're waiting on geocode
    } else {
      this.setDefaultMarker(); // No lat/long, address, or location, set default marker
    }

    this.initMap(); // Initialize the map when lat/long or default is set
  }

  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Set the initial marker
    this.setMarker({ lat: this.latitude, lng: this.longitude });

    // Add click event listener to map to update the marker
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.showLocationConfirmation(event.latLng);
      }
    });
  }

  setMarker(location: google.maps.LatLngLiteral) {
    // Remove existing marker if it exists
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Create a new marker at the specified location
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });

    // Update latitude and longitude in the form
    this.latitude = location.lat;
    this.longitude = location.lng;
    this.update.patchValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }

  setDefaultMarker() {
    this.latitude = this.defaultLocation.lat;
    this.longitude = this.defaultLocation.lng;
    this.initMap();
  }

  showLocationConfirmation(location: google.maps.LatLng) {
    if (this.selectionMode) {
      // In selection mode, just set the marker and emit the location
      this.setMarker(location.toJSON());
      this.getAddressFromLatLng(location.toJSON());
    } else {
      // In update mode, show confirmation
      Swal.fire({
        title: 'Update Location?',
        text: 'Are you sure you want to update your location?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          this.setMarker(location.toJSON());
          //this.updateUserLocation();
        }
      });
    }
  }

  getAddressFromLatLng(location: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        this.locationSelected.emit({
          lat: location.lat,
          lng: location.lng,
          address
        });
      } else {
        this.locationSelected.emit({
          lat: location.lat,
          lng: location.lng,
          address: `${location.lat}, ${location.lng}`
        });
      }
    });
  }

  // updateUserLocation() {
  //   const formData = new FormData();
  //   formData.append('latitude', String(this.latitude));
  //   formData.append('longitude', String(this.longitude));

  //   // Call the service to update the location
  //   this.userService.update_location(this.currenUser.id, formData).subscribe(
  //     response => {
  //       sessionStorage.setItem('doctordata', JSON.stringify(response));
  //       Swal.fire('Location updated!', '', 'success');
  //     },
  //     error => {
  //       console.error('Error updating location:', error);
  //       Swal.fire('Failed to update location', 'Please try again.', 'error');
  //     }
  //   );
  // }
}
