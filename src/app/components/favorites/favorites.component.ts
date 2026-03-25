import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { SupabaseService } from "../../services/supabase";
import { AuthService } from "../../services/auth.service";
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UI_MESSAGES } from "../../utils/messages";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './favorites.component.html',
  styleUrl: 'favorites.component.scss'
})

export class FavoritesComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog) ;

  savedFlights: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    if(this.authService.isGuest()){
      console.log('Usuario invitado sin credenciales');
      this.snackBar.open(UI_MESSAGES.ERROR.AUTH_REQUIRED, 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
            });
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

  async deleteFlight(flightId: string) {
    console.log('Iniciando proceso de borrado para el ID: ', flightId);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        title: UI_MESSAGES.CONFIRMATION.DELETE_TITLE, 
        message: UI_MESSAGES.CONFIRMATION.DELETE_MESSAGE 
      }
    }) ;

    dialogRef.afterClosed().subscribe(async (result:boolean) => {
      if (result) {
        console.log('Confirmación recibida desde el diálogo. Procediendo al borrado...');
        try {
          const { error } = await this.supabaseService.deleteFlight(flightId);
          if (error) {
            console.error('Error devuelto por Supabase:', error.message);
            console.error('Detalles del error:', error);
            this.snackBar.open(UI_MESSAGES.ERROR.GENERIC + error.message, 'Cerrar', {
              duration: 5000
            });
          return;
          }

          console.log('Borrado exitoso en Supabase. Filtrando lista local...');
          this.savedFlights = this.savedFlights.filter(flight => flight.flight_id !== flightId);
          this.snackBar.open(UI_MESSAGES.SUCCESS.FLIGHT_DELETED, 'OK', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } catch (err) {
            console.error('Error crítico (catch) en la ejecución:', err);
            this.snackBar.open(UI_MESSAGES.ERROR.DELETE_FLIGHT, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
      } else {
          console.log('Borrado cancelado por el usuario en el diálogo.');
        }
    });
  }
  
  goBack() {
        this.router.navigate(['/dashboard']);
  }
}