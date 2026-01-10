import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AmadeusService } from "../../services/amadeus.service";

@Component({
    selector: 'app-flights',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './flights.component.html',
    styleUrl: 'flights.component.scss'
})
export class FlightsComponent{
    private amadeusService = inject(AmadeusService) ;

    searchQuery = {
        origin: '',
        destination: '',
        date: '',
        returnDate: ''
    };

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