import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.loadDarkMode());
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyDarkMode(this.darkModeSubject.value);
  }

  /**
   * Load dark mode preference from localStorage
   */
  private loadDarkMode(): boolean {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
    this.applyDarkMode(newValue);
  }

  /**
   * Set dark mode
   */
  setDarkMode(enabled: boolean): void {
    this.darkModeSubject.next(enabled);
    localStorage.setItem('darkMode', JSON.stringify(enabled));
    this.applyDarkMode(enabled);
  }

  /**
   * Get current dark mode state
   */
  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  /**
   * Apply dark mode styles to the document
   */
  private applyDarkMode(enabled: boolean): void {
    if (enabled) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
    }
  }
}
