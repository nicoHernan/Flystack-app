import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import { user } from "@angular/fire/auth";
import { GeminiService } from "../../services/gemini.service";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: 'dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

    private geminiService = inject(GeminiService);
    private authService = inject (AuthService);
    private router = inject(Router);

    aiResponse: string | null = null;
    isLoading: boolean = false;
    userName: string | null = '' ;

    ngOnInit(){
        this.authService.user$.subscribe(user =>{
            if(user){
                this.userName = user.displayName ;
            } else{
                this.router.navigate(['/login']) ;
            }
        });
    }

    logout(){
        this.authService.logout().then(() =>{
            this.router.navigate(['/login']) ;
        }) ;
    }

    async obtenerInspiracion() {
        this.isLoading = true;
        this.aiResponse = null;

        const mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
        const ciudadEjemplo = 'Bariloche';

        try {
            this.aiResponse = await this.geminiService.getTravelInspiration(ciudadEjemplo, mesActual);
        } catch (error) {
            this.aiResponse = 'No pudimos conectar con el experto en viajes. Inténtalo de nuevo.';
        } finally {
        this.isLoading = false;
        }
    }
}