import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.css']
})
export class NotificationSettingComponent implements OnInit {
  currentUser : any
  constructor(private auth: AuthService, private toastr: ToastrService,
    private translate: TranslateService) { 
    this.currentUser = this.auth.getcurrentuser();
  }

  ngOnInit(): void {
  }
  toggleEmailNotifications(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.is_emailable = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updateEmailNotificationPreference(this.currentUser.id, isChecked).subscribe({

        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            let notificationColor: 'info' = 'info';
            let notificationMessage = `DermaProPro Email notification preference updated successfully!`;
            this.toastr[notificationColor](notificationMessage, "updated", {
            timeOut: 5000 // Display for 4 seconds
        });
        },
        error: (error) => {
            console.error('Failed to update email notification preference', error);
        }
    });
}

toggleSystemNotifications(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.is_notifiable = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updateSystemNotificationPreference(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            let notificationColor: 'warning' = 'warning';
            let notificationMessage = `DermaProPro notification preference updated successfully!`;
            this.toastr[notificationColor](notificationMessage, "updated", {
            timeOut: 5000 // Display for 4 seconds
        });
            console.log('System notification preference updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update system notification preference', error);
        }
    });
}


toggleSmsNotifications(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.is_smsable = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updatetoggleSmsNotifications(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            let notificationColor: 'info' = 'info';
            let notificationMessage = `DermaProPro SMS Notification Updated!`;
            this.toastr[notificationColor](notificationMessage, "updated", {
            timeOut: 5000 // Display for 4 seconds
        });
            console.log('Working in saturday updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update Working in saturday', error);
        }
    });
}

toggleLanguage(event: any) {
    const selectedLanguage = event.target.value;

    const formData = new FormData();
    formData.append('language', String(selectedLanguage));

    // Call the service to update the location
    this.auth.ChangeDefaultLanguage(this.currentUser.id, formData).subscribe(
    response => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        let notificationColor: 'success' = 'success';
            let notificationMessage = `DermaProPro System Language Updated!!`;
            this.toastr[notificationColor](notificationMessage, "updated", {
            timeOut: 5000 // Display for 4 seconds
        });
        this.translate.use(selectedLanguage); 
    },
    error => {
        console.error('Error updating Language:', error);
        Swal.fire('Failed to update Language', 'Please try again later .', 'error');
    }
    );
    }
                        
    updateUserPhoneNumber() {
        this.auth.updateUserPhoneNumber(this.currentUser.id, {
            phone_number: this.currentUser.phone_number
        }).subscribe({
            next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            let notificationColor: 'success' = 'success';
            let notificationMessage = `pohne number updated successfully!!`;
            this.toastr[notificationColor](notificationMessage, "updated", {
            timeOut: 5000 // Display for 4 seconds
        });
                console.log('pohne number updated successfully!', response);
            },
            error: (error) => {
                console.error('Failed to update phone number', error);
            }
        });
    }
}
