import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import { user } from "@angular/fire/auth";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: 'dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

    private authService = inject (AuthService);
    private router = inject(Router);

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
}