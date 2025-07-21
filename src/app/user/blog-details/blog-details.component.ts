import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
})
export class BlogDetailsComponent implements OnInit {
  blogDetail: any = [];
  currentUser:any
showPendingMessage: boolean = false;
  messageErr = '';
  role : any
  constructor(
    private usersService: AdminService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient,
    private Auth :AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.Auth.getRole();
    this.currentUser = this.auth.getcurrentuser();



    const blogId = this.activatedRoute.snapshot.params['id'];
    this.usersService.getBlog(blogId).subscribe(
      (data) => {
        this.blogDetail = data;
        console.log(this.blogDetail);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't found this blog in our database";
      }
    );
  }

  

    AddVerification(id: any) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Add Verify to it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usersService.addVerification(id).subscribe(
            response => {
              Swal.fire({
                title: 'Success!',
                text: 'The verification has been added successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                width: '400px',
              }).then(() => {
                // Reload the page after a successful update
                window.location.reload();
              });
            },
            error => {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error adding the verification.',
                icon: 'error',
                confirmButtonText: 'OK',
                width: '400px',
              });
            }
          );
        }
      });
    }
}
