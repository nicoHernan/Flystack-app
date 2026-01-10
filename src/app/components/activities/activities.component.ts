import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activities.component.html',
    styleUrl: 'activities.component.scss'
})
export class ActivitiesComponent{
    constructor(){}
}