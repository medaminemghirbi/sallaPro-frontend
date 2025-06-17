import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from 'src/app/services/doctor.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  doctorId!: number;
  doctorData: any;
  isLoading: boolean = false;
  activeIndex: number | null = 1; // Default open (e.g., index 1)
  p:number = 1 ;

  constructor(
    private activatedRoute: ActivatedRoute,

    private http: HttpClient,
    private doctorService: DoctorService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.doctorId = this.activatedRoute.snapshot.params['id'];
    this.doctorService.getDoctorDetails(this.doctorId).subscribe(
      (data) => {
        this.isLoading = true;
        this.doctorData = data;
        this.isLoading = false;
        console.log(this.doctorData);
        this.initMap();
      },
      (error) => {
        console.error('Error fetching doctor data:', error);
      }
    );
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
    generateStars(totalRating: number, ratingCount: number): { filled: boolean }[] {
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(averageRating)) {
        stars.push({ filled: true });
      } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
        stars.push({ filled: true, partial: true });
      } else {
        stars.push({ filled: false });
      }
    }
    return stars;
  }
  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
    initMap(): void {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: this.doctorData?.latitude, lng: this.doctorData?.longitude },
      zoom: 18,
    });

    new google.maps.Marker({
      position: { lat: this.doctorData?.latitude, lng: this.doctorData?.longitude },
      map: map,
      title: 'Doctor Location',
    });
  }
    onShareClick(event: MouseEvent) {
      event.preventDefault();  // prevent navigation if you want to stay on page after copy

      const url = window.location.href;

      // Use Clipboard API to copy the URL
      navigator.clipboard.writeText(url).then(() => {
      }).catch(err => {
        alert('Failed to copy URL: ' + err);
      });
    }


    addToFavorites(doctor: any): void {
      localStorage.setItem('favoriteDoctor', JSON.stringify(doctor));
      alert(`${doctor.firstname} has been set as your favorite doctor.`);
      setTimeout(() => {
        location.reload();
      }, 1000); // 1000 ms = 1 second
    }

}
