import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-superadmin',
  templateUrl: './header-superadmin.component.html',
  styleUrls: ['./header-superadmin.component.css'],
})
export class HeaderSuperadminComponent implements OnInit {
  currentUser: any;
  languages = [
    { code: 'fr', label: 'Français', flag: 'assets/img/flags/fr.png' },
    { code: 'en', label: 'English', flag: 'assets/img/flags/us.png' },
    { code: 'ar', label: 'العربية', flag: 'assets/img/flags/flag-03.png' },
  ];
  selectedLanguage = this.languages[0]; // Par défaut français

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.auth.getcurrentuser().subscribe({
      next: (response: any) => {
        this.currentUser = response.user; // your API shape
        console.log('Current User:', this.currentUser);

        // Set selected language based on user preference
        const userLang = this.currentUser.language || 'fr'; // fallback to French
        const langObj =
          this.languages.find((l) => l.code === userLang) || this.languages[0];

        this.selectedLanguage = langObj;
        this.translate.use(langObj.code);
        this.languageService.setLanguage(langObj.code);
      },
      error: (err: any) => {
        console.error('Error fetching current user', err);
        // fallback to default language if API fails
        this.selectedLanguage = this.languages[0];
        this.translate.use(this.selectedLanguage.code);
        this.languageService.setLanguage(this.selectedLanguage.code);
      },
    });
  }

  logout() {
    this.auth.logout(); // ton service logout
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // recharge la page après la navigation
    });
  }

  toggleSidebar(): void {
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.toggle('mini-sidebar');
    }
  }

  toggleMobileMenu(): void {
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.toggle('slide-nav');
    }
  }

  changeLanguage(lang: any) {
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
        // Update UI
        this.selectedLanguage = lang;
        this.translate.use(lang.code);
        this.languageService.setLanguage(lang.code);
      },
      (error) => {
        console.error('Error updating Language:', error);
        Swal.fire(
          'Failed to update Language',
          'Please try again later.',
          'error'
        );
      }
    );
  }
}
