import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { UI_MESSAGES } from '../../utils/messages';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.snackBar.open(UI_MESSAGES.SUCCESS.LOGIN_CREDENTIALS, 'OK',{
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }) ;
    } catch (e) {
        this.snackBar.open(UI_MESSAGES.ERROR.LOGIN_CREDENTIALS, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
  }

  async loginAsGuest() {
    try {
      await this.authService.loginAnonymously();
      this.snackBar.open(UI_MESSAGES.SUCCESS.LOGIN_GUEST, 'OK',{
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }) ;
    } catch (e) {
        this.snackBar.open(UI_MESSAGES.ERROR.LOGIN_GUEST, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
    }
  }
}