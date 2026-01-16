import { Component,inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './settings.component.html',
    styleUrl: 'settings.component.scss'
})

export class SettingsComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  
  userData: any = null;

  goBack() {
        this.router.navigate(['/dashboard']);
    }
    
  toggleDark(event: any) {
    this.themeService.toggleTheme();
  }
  
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userData = user;
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }
}