import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  messageErr= "";
  public userType: string = '';
  statistique:any = []; 
  admindata:any;

  appointement_count: any;
  patient_count: any;
  BLogs_count: any;
  doctors_count: any;
  scanned_count: any;
  maladies_count: any;

  chartOptions: any;
  chartDatasets: any = [];
  chartLabels: any = [];
  chartColors: any = [];
  chartReady = false;
  chartReady1 = false;
  topN: number = 5;
  chartType: string = 'bar';
  chartType2: string = 'bar'; // separate from chartType
  chartType3: string = 'pie'; // separate from chartType
  chartType4: string = 'pie'; // separate from chartType

  fullChartLabels: string[] = ['Tunis', 'Sfax', 'Sousse', 'Gabes', 'Bizerte', 'Ariana', 'Nabeul', 'Monastir', 'Kairouan', 'Gafsa', 'Kasserine', 'Kebili', 'Mahdia', 'Beja', 'Jendouba', 'Medinine', 'Tataouine', 'Zaghouan', 'Tozeur', 'Siliana'];
  fullChartDatasets: any[] = [
    {
      data: [120, 110, 90, 80, 75, 70, 65, 60, 55, 50, 48, 45, 40, 38, 35, 30, 28, 25, 20],
      label: 'Consultations'
    }
  ];
  filteredChartLabels: string[] = [];
  filteredChartDatasets: any[] = [];

  genderChartLabels: string[] = [];
  genderChartData: any[] = [];

  plateformChartLabels: string[] = [];
  plateformChartData: any[] = [];
  chartReady4 = false;

  chartReady3 = false;


  constructor( private route: Router , private auth: AuthService, private usersService: AdminService ) { 
    
    this.chartLabels = ['Consultation', 'Patient', 'Blogs', 'Doctors', 'Number of diseases trained by AI', 'Scanned Image With IA'];
    this.chartColors = [
      {
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(135, 107, 28, 0.2)',
          'rgba(28, 13, 236, 0.2)',

          'rgba(243, 215, 55, 0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(135, 107, 28, 1)',
          'rgba(28, 13, 236, 0.2)',
          'rgba(243, 215, 55, 0.2)',
        ],
        borderWidth: 2,
      }
    ];
    this.chartOptions = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8
    };
  }

  ngOnInit(): void {
    this.updateTopData(); // initialize filtered data

    this.admindata = JSON.parse(sessionStorage.getItem('admindata')!);
    this.userType = sessionStorage.getItem('user_type') || 'Guest';
  
    // First API call for general statistics
    this.usersService.statistique().subscribe(
      (data) => {
        this.chartDatasets = [
          { 
            data: [
              data.apointements, 
              data.patients, 
              data.blogs, 
              data.doctors, 
              data.maladies,
              data.scanned
            ], 
            label: 'DermaPro Officiel statistic' 
          }
        ];
        this.chartReady1 = true;
      }, 
      (err: HttpErrorResponse) => {
        this.messageErr = "We didn't find any data in our database.";
      }
    );

    // Second API call for Top 5 consultations
    this.usersService.statistiqueTop5().subscribe(
      (data) => {
        // Assuming the API response structure is like:
        // { "gabes": 205, "hammamet": 101, "monastir": 99, "ariana": 95, "ben-arous": 1 }
        
        // Process the response to match the chart structure
        const cities = Object.keys(data);
        const consultations = Object.values(data);
        
        // Update filtered data based on the selected topN
        this.filteredChartLabels = cities.slice(0, this.topN);
        this.filteredChartDatasets = [
          {
            data: consultations.slice(0, this.topN),
            label: 'Top Consultations in Tunisia'
          }
        ];
        
        this.chartReady = true;
      },
      (err: HttpErrorResponse) => {
        this.messageErr = "We didn't find any data in our database.";
      }
    );

    // Third API by gender
    this.usersService.statistiquebyGender().subscribe(
      (data) => {
        // Extract labels (genders) and values (totals)
        const labels = data.map((item: { gender: any; }) => item.gender);
        const values = data.map((item: { total: any; }) => item.total);

        // Assign to chart properties
        
        this.genderChartLabels = labels;
        this.genderChartData = [
          {
            data: values,
            label: labels
          }
        ];
        console.log(this.genderChartData)
        this.chartReady3 = true;
      },
      (err: HttpErrorResponse) => {
        this.messageErr = "We didn't find any data in our database.";
      }
    );


    // Third API by gender
    this.usersService.statistiquebyPlatforme().subscribe(
      (data) => {
        // Extract labels (genders) and values (totals)
        const labels = data.map((item: { plateform: any; }) => item.plateform);
        const values = data.map((item: { total: any; }) => item.total);

        // Assign to chart properties
        
        this.plateformChartLabels = labels;
        this.plateformChartData = [
          {
            data: values,
            label: labels
          }
        ];
        this.chartReady4 = true;
      },
      (err: HttpErrorResponse) => {
        this.messageErr = "We didn't find any data in our database.";
      }
    );

    
  }

  chartClicked(event: any): void {}

  chartHovered(event: any): void {}

  updateTopData() {
    this.filteredChartLabels = this.fullChartLabels.slice(0, this.topN);
    this.filteredChartDatasets = [
      {
        data: this.fullChartDatasets[0].data.slice(0, this.topN),
        label: this.fullChartDatasets[0].label
      }
    ];
  }
}
