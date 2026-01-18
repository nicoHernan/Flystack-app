import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AmadeusService } from "../../services/amadeus.service";
import { SupabaseService } from "../../services/supabase";
import { AuthService } from "../../services/auth.service";
import { user } from "@angular/fire/auth";
import { AIRLINE_NAMES } from "../../utils/airline-codes";
import { Router } from "@angular/router";

@Component({
    selector: 'app-flights',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './flights.component.html',
    styleUrl: 'flights.component.scss'
})
export class FlightsComponent{
    private amadeusService = inject(AmadeusService) ;
    private supabaseService = inject(SupabaseService) ;
    private authService = inject(AuthService) ;
    private router = inject(Router) ;

    searchQuery = {
        origin: '',
        destination: '',
        date: '',
        returnDate: ''
    };

    getAirlineName(code: string): string {
        return AIRLINE_NAMES[code] || `Aerolínea (${code})`;
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    saveFlight(flight: any) {
        if (this.authService.isGuest()) {
            alert('Para guardar tus vuelos favoritos y verlos más tarde, por favor inicia sesión o regístrate.');
            return;
        }

        const sub = this.authService.user$.subscribe({
            next: async (user) => {
                if (user && user.uid) {
                    try {
                        const { data, error } = await this.supabaseService.saveFlight(flight, user.uid);
                        if (error) throw error;
                        alert("¡Vuelo guardado con éxito!");
                    } catch (err) {
                    console.error("Error al guardar en Supabase:", err);
                    alert("Hubo un error al guardar el vuelo.");
                    }
                } else {
                    alert("Debes estar logueado para realizar esta acción.");
                }
                sub.unsubscribe();
            },
        error: (err) => console.error("Error al obtener el usuario:", err)
        });
    }

  flightOffers: any[] = [];
  loading = false;
  error: string | null = null;

    async onSearch() {
        this.loading = true;
        this.error = null;

        try {
            const response: any = await this.amadeusService.getFlightOffers(
            this.searchQuery.origin.toUpperCase(),
            this.searchQuery.destination.toUpperCase(),
            this.searchQuery.date,
            this.searchQuery.returnDate
        );

        this.flightOffers = response.data;

        if (this.flightOffers.length === 0) {
            this.error = 'No se encontraron vuelos para esta fecha.';
        }
        } catch (err) {
            this.error = 'Error al conectar con la API de vuelos. Verifica tus credenciales.';
            console.error(err);
        } finally {
            this.loading = false;
        }
    }
}