import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';
import { SidebarService } from './services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'reservily';
  currentUser:any
  DefaultLanguage:any
  sidebarMinimized = false;
  private subscription?: Subscription;

  constructor(private translate: TranslateService,
    private auth: AuthService,
    private usersService: AdminService,
    private languageService: LanguageService,
    private sidebarService: SidebarService
  ) {}
  
  ngOnInit(): void {
    this.languageService.initializeLanguage();

    // Subscribe to sidebar state changes
    this.subscription = this.sidebarService.sidebarMinimized$.subscribe(state => {
      this.sidebarMinimized = state;
    });

    this.auth.getcurrentuser().subscribe({
      next: (response: any) => {
        this.currentUser = response.user; // depends on your API shape
        console.log('Current User:', this.currentUser);
        // Fetch backend language preference if user exists
        if (this.currentUser && this.currentUser.id) {
          this.usersService.getDefaultLanguage(this.currentUser.id).subscribe({
            next: (data) => {
              this.DefaultLanguage = data;
              if (this.DefaultLanguage && this.DefaultLanguage.language) {
                // Update language from backend preference
                this.languageService.setLanguage(this.DefaultLanguage.language);
              }
            },
            error: (err) => {
              console.error('Error fetching default language:', err);
            },
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching current user', err);
        // Keep the initialized language
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
