import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css'],
})
export class AdminSettingsComponent implements OnInit {
  currentUser: any;
  currentCompany: any;
  languages = [
    { code: 'fr', label: 'Français', flag: 'assets/img/flags/fr.png' },
    { code: 'en', label: 'English', flag: 'assets/img/flags/us.png' },
    { code: 'ar', label: 'العربية', flag: 'assets/img/flags/flag-03.png' },
  ];
  selectedLanguage = this.languages[0];
  preferences = {
    notificationsEmail: true,
    notificationsSms: false,
    darkMode: false,
  };
  timezones = [
    { value: 'UTC-05:00', label: 'GMT -05:00' },
    { value: 'UTC-03:00', label: 'GMT -03:00' },
    { value: 'UTC+00:00', label: 'GMT +00:00' },
    { value: 'UTC+01:00', label: 'GMT +01:00' },
    { value: 'UTC+02:00', label: 'GMT +02:00' },
    { value: 'UTC+03:00', label: 'GMT +03:00' },
    { value: 'UTC+05:00', label: 'GMT +05:00' },
  ];
  selectedTimezone = 'UTC+01:00';

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private darkModeService: DarkModeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedTz = localStorage.getItem('preferredTimezone');
    if (storedTz) {
      this.selectedTimezone = storedTz;
    }

    this.preferences.darkMode = this.darkModeService.isDarkMode();
    this.darkModeService.darkMode$.subscribe((isDark) => {
      this.preferences.darkMode = isDark;
    });

    this.auth.getcurrentuser().subscribe({
      next: (response: any) => {
        this.currentUser = response.user;
        const userLang = this.currentUser.language || 'fr';
        const langObj =
          this.languages.find((l) => l.code === userLang) || this.languages[0];
        this.selectedLanguage = langObj;
      },
      error: () => {
        this.selectedLanguage = this.languages[0];
      },
    });

    this.auth.getcurrentcompany().subscribe({
      next: (response: any) => {
        // Handle different possible API response structures
        this.currentCompany = response?.company || response?.data || response || {};
        console.log('Current Company loaded:', this.currentCompany);
      },
      error: (err :any) => {
        console.error('Error fetching current company:', err);
        this.currentCompany = {};
      }
    });
  }

  changeLanguage(lang: any): void {
    if (!this.currentUser) return;

    const formData = new FormData();
    formData.append('language', lang.code);

    this.auth.ChangeDefaultLanguage(this.currentUser.id, formData).subscribe(
      (response) => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        this.translate
          .get('MESSAGES.LANGUAGE_UPDATED')
          .subscribe((res: string) => {
            Swal.fire(res, '', 'success');
          });
        this.selectedLanguage = lang;
        this.translate.use(lang.code);
        this.languageService.setLanguage(lang.code);
      },
      () => {
        Swal.fire(
          this.translate.instant('ERROR.TITLE'),
          this.translate.instant('MESSAGES.LANGUAGE_UPDATE_FAILED') || '',
          'error'
        );
      }
    );
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  toggleNotification(key: 'notificationsEmail' | 'notificationsSms'): void {
    this.preferences[key] = !this.preferences[key];
    Swal.fire({
      icon: 'success',
      title: this.translate.instant('SETTINGS.SAVED'),
      timer: 900,
      showConfirmButton: false,
    });
  }

  changeTimezone(tz: string): void {
    this.selectedTimezone = tz;
    localStorage.setItem('preferredTimezone', tz);
    Swal.fire({
      icon: 'success',
      title: this.translate.instant('HEADER.TIMEZONE'),
      text: `${this.translate.instant('HEADER.SELECT_TIMEZONE')}: ${tz}`,
      timer: 1200,
      showConfirmButton: false,
    });
  }

  backToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  updateCompanyInfo(formData: FormData): void {
    if (!this.currentUser) return;
    // TODO: Call API to update company info
    Swal.fire({
      icon: 'success',
      title: this.translate.instant('SETTINGS.SAVED'),
      timer: 1200,
      showConfirmButton: false,
    });
  }
}
