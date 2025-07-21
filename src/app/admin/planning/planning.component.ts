import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ReportsService } from 'src/app/services/pdf/reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  itemsPerPage:number = 100;
  locations: any = [];
  doctors: any = [];
  filteredAppointments: any[] = [];
  availableDates: string[] = [];
  p: number = 1;
  searchedKeyword!: string;
  messageErr: string = '';
  selectedLocation : string = '';
  selectedDoctorId: string = '';
  selectedDate: string = '';
  doctorAppointements: any;
  counter: any;
  selectedDoctorName!: string;
  message!: string;
  data_demande = {
    id: '',
    status: '',
    refus_reason: ''
  };
  loading: boolean = false;

  constructor(private usersService: AdminService, private route: Router, private pdfService: ReportsService) { }

  async ngOnInit(): Promise<void> {
    
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      console.log(this.locations)
      this.locations.sort((a: any, b: any) => a.name.localeCompare(b.name));

      console.log(this.locations);
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
    console.log(this.selectedLocation)
    this.selectedLocation = this.locations[20];
    this.getDoctorsByLocation(this.selectedLocation)
    
  }

getDoctorsByLocation(location: any): void {
  this.selectedLocation = location;
  console.log("Selected Location:", this.selectedLocation);

  // Reset before loading new data
  this.doctorAppointements = null;
  this.filteredAppointments = [];
  this.selectedDoctorName = '';
  this.availableDates = [];
  this.selectedDoctorId = '';

  if (this.selectedLocation) {
    this.usersService.getDoctorsByLocation(this.selectedLocation).subscribe(
      (data) => {
        this.doctors = data || [];

        this.doctors.sort((a: any, b: any) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        });

        if (this.doctors.length === 0) {
          this.message = "No doctors available for the selected location.";
          this.selectedDoctorId = '';
        } else {
          // Automatically select the first doctor
          this.selectedDoctorId = this.doctors[0].id;
          this.onDoctorChange(this.selectedDoctorId);
        }
        console.log("Doctors List:", this.doctors);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching doctors:", err);
        this.doctors = [];
        this.selectedDoctorId = '';
      }
    );
  } else {
    this.doctors = [];
    this.doctorAppointements = null;
    this.selectedDoctorName = '';
    this.availableDates = [];
  }
}

  
onDoctorChange(doctor_id: string): void {
  this.selectedDoctorId = doctor_id;
  console.log("Selected Doctor ID:", this.selectedDoctorId);

  if (this.selectedDoctorId) {
    this.loading = true;

    this.usersService.getDoctorDetails(this.selectedDoctorId).subscribe(
      (data) => {
        this.doctorAppointements = data.sort((a: any, b: any) => {
          const dateA = new Date(a.appointment).getTime();
          const dateB = new Date(b.appointment).getTime();
          return dateA - dateB;
        });

        this.updateAvailableDates();
        this.filterAppointmentsByDate();

        if (data.length > 0) {
          const doctor = data[0].doctor;
          this.selectedDoctorName = `Dr. ${doctor.firstname} ${doctor.lastname}`;
        } else {
          this.selectedDoctorName = '';
        }
        console.log("Doctor Details:", this.doctorAppointements);
        this.loading = false;
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching doctor details:", err);
        this.doctorAppointements = null;
        this.selectedDoctorName = '';
        this.loading = false;
      }
    );
  } else {
    this.doctorAppointements = null;
    this.selectedDoctorName = '';
    this.availableDates = [];
  }
}

  updateAvailableDates(): void {
    if (this.doctorAppointements && Array.isArray(this.doctorAppointements)) {
      // Extract dates and remove duplicates
      const dates = new Set(this.doctorAppointements.map((appointment: any) => appointment.appointment.split('T')[0]));
      // Convert to array and sort the dates
      this.availableDates = Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    } else {
      this.availableDates = [];
    }
  }

  filterByDate(selectedDate: string): void {
    if (selectedDate === '') {
      // Show all appointments if "All Dates" is selected
      this.filteredAppointments = this.doctorAppointements;
    } else {
      // Filter appointments by the selected date
      this.filteredAppointments = this.doctorAppointements.filter((appointment: any) =>
        appointment.appointment.startsWith(selectedDate)
      );
    }
  }
  filterAppointmentsByDate(): void {
    if (this.selectedDate && this.doctorAppointements) {
      this.filteredAppointments = this.doctorAppointements.filter((appointment: any) =>
        appointment.appointment.startsWith(this.selectedDate)
      );
    } else {
      this.filteredAppointments = this.doctorAppointements || [];
    }
  }
  downloadPDF(item: any) {
    this.pdfService.generatePDF([item]); // Pass the selected item or items
  }

  delete(id: any, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.ArchiverAppointement(id).subscribe(
          response => {
            this.doctorAppointements.splice(i, 1);
            Swal.fire(
              'Deleted!',
              'has been Archived.',
              'success'
            );
          },
        );
      }
    });
  }
}
