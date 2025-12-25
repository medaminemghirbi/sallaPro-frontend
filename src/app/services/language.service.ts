import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private storageKey = 'selectedLanguage';
  private defaultLanguage = 'fr';

  constructor(private translate: TranslateService) {}

  /**
   * Initialize language on app startup
   * Priority: 1. sessionStorage 2. Backend preference 3. Default language
   */
  initializeLanguage(backendLanguage?: string): string {
    const savedLanguage = this.getSavedLanguage();
    
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
      return savedLanguage;
    }

    if (backendLanguage) {
      this.setLanguage(backendLanguage);
      return backendLanguage;
    }

    this.setLanguage(this.defaultLanguage);
    return this.defaultLanguage;
  }

  /**
   * Set the active language and save to sessionStorage
   */
  setLanguage(langCode: string): void {
    this.translate.use(langCode);
    this.translate.setDefaultLang(langCode);
    sessionStorage.setItem(this.storageKey, langCode);
  }

  /**
   * Get the saved language from sessionStorage
   */
  getSavedLanguage(): string | null {
    return sessionStorage.getItem(this.storageKey);
  }

  /**
   * Get current language
   */


  /**
   * Clear saved language
   */
  clearSavedLanguage(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
