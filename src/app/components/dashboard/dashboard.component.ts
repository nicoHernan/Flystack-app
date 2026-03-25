import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import { user } from "@angular/fire/auth";
import { GeminiService } from "../../services/gemini.service";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { UI_MESSAGES } from "../../utils/messages";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSnackBarModule],
    templateUrl: './dashboard.component.html',
    styleUrl: 'dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

    destinoControl = new FormControl('', [Validators.required, Validators.minLength(3)]) ;

    private snackBar = inject(MatSnackBar);
    private geminiService = inject(GeminiService);
    private authService = inject (AuthService);
    private router = inject(Router);

    aiResponse: string | null = null;
    isLoading: boolean = false;
    userName: string | null = '' ;

    ngOnInit(){
        this.authService.user$.subscribe(user =>{
            if(user){
                this.userName = user.isAnonymous ? 'Invitado' : user.displayName;
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
        if(this.destinoControl.invalid) return ;

        this.isLoading = true;
        this.aiResponse = null;

        const mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
        const ciudadEjemplo = this.destinoControl.value as string ;

        try {
            this.aiResponse = await this.geminiService.getTravelInspiration(ciudadEjemplo, mesActual);
        } catch (error) {
            this.aiResponse = UI_MESSAGES.ERROR.AI_RESPONSE ;
        } finally {
            this.isLoading = false;
        }
    }

    goToSettings() {
        this.router.navigate(['/settings']);
    }

    goToFavorites() {
        this.router.navigate(['/favorites']);
    }
}