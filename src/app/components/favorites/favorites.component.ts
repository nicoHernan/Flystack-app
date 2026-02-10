import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { SupabaseService } from "../../services/supabase";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: 'favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
   supabaseService = inject(SupabaseService);
   authService = inject(AuthService);
  router = inject(Router);

  savedFlights: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    if(this.authService.isGuest()){
      alert('Acceso denegado: Esta sección es solo para usuarios registrados.');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadSavedFlights(user.uid);
      }
    });
  }

  async loadSavedFlights(userId: string) {
    try {
      const { data, error } = await this.supabaseService.getSavedFlights(userId);
      if (error) throw error;
      this.savedFlights = data || [];
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteFlight(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este vuelo de tus favoritos?')) {
      const { error } = await this.supabaseService.deleteFlight(id);
      if (!error) {
        this.savedFlights = this.savedFlights.filter(f => f.id !== id);
      }
    }
  }

  goBack() {
        this.router.navigate(['/dashboard']);
    }
}