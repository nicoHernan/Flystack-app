import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  toggleTheme() {
    this.darkMode ? this.disableDarkMode() : this.enableDarkMode();
  }

  private enableDarkMode() {
    this.darkMode = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  private disableDarkMode() {
    this.darkMode = false;
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }

  isDarkMode() { return this.darkMode; }
}