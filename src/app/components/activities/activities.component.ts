import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmadeusService } from "../../services/amadeus.service";
import { FEATURED_CITIES, CityLocation } from "../../utils/destinations";
import { Router } from "@angular/router";

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activities.component.html',
    styleUrl: 'activities.component.scss'
})
export class ActivitiesComponent implements OnInit{
    private amadeusService = inject(AmadeusService);
    private router = inject(Router) ;

    cities = FEATURED_CITIES;
    selectedCity: CityLocation = this.cities[0];
    activities: any[] = [];
    loading = false;

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    ngOnInit() {
        this.loadActivities();
    }

    onCityChange(city: CityLocation) {
        this.selectedCity = city;
        this.loadActivities();
    }

    async loadActivities() {
        this.loading = true;
        try {
            const response: any = await this.amadeusService.getActivities(
            this.selectedCity.lat, 
            this.selectedCity.lon
            );
            this.activities = response.data;
        } catch (error) {
            console.error("Error al buscar actividades:", error);
        } finally {
        this.loading = false;
        }
    }
}