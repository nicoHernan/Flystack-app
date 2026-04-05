import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AmadeusService } from "../../services/amadeus.service";
import { BookmarkService } from "../../services/bookmark.service";
import { AuthService } from "../../services/auth.service";
import { user } from "@angular/fire/auth";
import { AIRLINE_NAMES } from "../../utils/airline-codes";
import { Router } from "@angular/router";
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { UI_MESSAGES } from "../../utils/messages";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-flights',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ],
    templateUrl: './flights.component.html',
    styleUrl: 'flights.component.scss'
})
export class FlightsComponent{
    private amadeusService = inject(AmadeusService) ;
    private bookmarkService = inject(BookmarkService) ;
    private authService = inject(AuthService) ;
    private router = inject(Router) ;
    private snackBar = inject(MatSnackBar);

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

    favoriteFlightIds: string[] = [];//TODO
    isFlightFavorite(flight: any): boolean {
        if (!flight || !flight.id) return false;
            return this.favoriteFlightIds.includes(flight.id);
    }

    saveFlight(flight: any) {
        if (this.authService.isGuest()) {
            this.snackBar.open(UI_MESSAGES.ERROR.AUTH_REQUIRED, 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
            });
            return;
        }

        const sub = this.authService.user$.subscribe({
            next: async (user) => {
                if (user && user.uid) {
                    try {
                        const { data: existing, error: checkError } = await this.bookmarkService.checkIfFavorite(user.uid, flight);
                        if (existing && existing.length > 0) {
                            this.snackBar.open(UI_MESSAGES.INFO.ALREADY_FAVORITE, 'Aviso', {
                            duration: 3000
                            });
                            return;
                        }

                        const {error} = await this.bookmarkService.saveFlight(flight, user.uid);
                        if (error) throw error;

                        this.snackBar.open(UI_MESSAGES.SUCCESS.FLIGHT_SAVED, 'OK', {
                            duration: 3000,
                            horizontalPosition: 'center',
                            verticalPosition: 'top'
                        });

                    } catch (err) {
                        console.error("Error al guardar en Supabase:", err);
                        this.snackBar.open(UI_MESSAGES.ERROR.SAVE_FLIGHT, 'Cerrar', {
                            duration: 3000,
                            horizontalPosition: 'center',
                            verticalPosition: 'bottom'
                        });
                    }
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