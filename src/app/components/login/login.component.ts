import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    
  private authService = inject(AuthService);

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      alert('¡Bienvenido con Google!');
    } catch (e) {
      alert('Error al entrar con Google');
    }
  }

  async loginAsGuest() {
    try {
      await this.authService.loginAnonymously();
      alert('¡Bienvenido como Invitado!');
    } catch (e) {
      alert('Error al entrar como invitado');
    }
  }
}