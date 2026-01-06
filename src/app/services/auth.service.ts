import { Injectable, inject } from '@angular/core';

import{
  Auth,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  user
} from '@angular/fire/auth' ;

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);


  constructor() {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error('Error Google Login:', error);
      throw error;
    }
  }

  async loginAnonymously() {
    try {
      const result = await signInAnonymously(this.auth);
      return result;
    } catch (error) {
      console.error('Error Anonymous Login:', error);
      throw error;
    }
  }

  logout() {
    return signOut(this.auth);
  }
}
