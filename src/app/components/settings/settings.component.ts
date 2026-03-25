import { Component,inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { UI_MESSAGES } from "../../utils/messages";

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './settings.component.html',
    styleUrl: 'settings.component.scss'
})

export class SettingsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private router = inject(Router);
  themeService = inject(ThemeService);
  
  userData: any = null;

  goBack() {
        this.router.navigate(['/dashboard']);
    }
    
  toggleDark(event: any) {
    this.themeService.toggleTheme();
  }
  
  ngOnInit() {
    if(this.authService.isGuest()){
      console.log('Usuario invitado sin credenciales');
      this.snackBar.open(UI_MESSAGES.ERROR.AUTH_REQUIRED, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.router.navigate(['/dashboard']);
      return;
    }
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