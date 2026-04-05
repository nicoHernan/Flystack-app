import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import{
  Auth,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  user
} from '@angular/fire/auth' ;

import { BookmarkService } from './bookmark.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private router = inject(Router);
  private auth: Auth = inject(Auth);
  private bookmarkService = inject(BookmarkService);

  user$ = user(this.auth);

  constructor() {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        await this.bookmarkService.createProfile(result.user);
        this.router.navigate(['/dashboard']);
      }

      return result;
    } catch (error: any) {
        console.error('Código de error de Firebase:', error.code);
        console.error('Mensaje completo:', error.message);
        throw error;
    }
  }

  async loginAnonymously() {
    try {
      const result = await signInAnonymously(this.auth);
      
      if (result.user) {
        await this.bookmarkService.createProfile(result.user);
        this.router.navigate(['/dashboard']);
      }

      return result;
    } catch (error) {
      console.error('Error Anonymous Login:', error);
      throw error;
    }
  }

  isGuest(): boolean {
    const currentUser = this.auth.currentUser;
    return currentUser ? currentUser.isAnonymous : false;
  }

  logout() {
    return signOut(this.auth);
  }
}
