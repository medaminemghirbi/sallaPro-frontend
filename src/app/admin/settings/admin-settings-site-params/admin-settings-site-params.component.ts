import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-settings-site-params',
  templateUrl: './admin-settings-site-params.component.html',
  styleUrls: ['./admin-settings-site-params.component.css'],
})
export class AdminSettingsSiteParamsComponent implements OnInit {
  @Input() languages: any[] = [];
  @Input() selectedLanguage: any;
  @Input() preferences: any;
  @Input() timezones: any[] = [];
  @Input() selectedTimezone: string = '';

  @Output() languageChanged = new EventEmitter<any>();
  @Output() timezoneChanged = new EventEmitter<string>();
  @Output() darkModeToggled = new EventEmitter<void>();
  @Output() notificationToggled = new EventEmitter<'notificationsEmail' | 'notificationsSms'>();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private darkModeService: DarkModeService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  changeLanguage(lang: any): void {
    this.languageChanged.emit(lang);
  }

  changeTimezone(tz: string): void {
    this.timezoneChanged.emit(tz);
  }

  toggleDarkMode(): void {
    this.darkModeToggled.emit();
  }

  toggleNotification(key: 'notificationsEmail' | 'notificationsSms'): void {
    this.notificationToggled.emit(key);
  }
}
