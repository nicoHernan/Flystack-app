import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },

    {
        path: 'dashboard',
        loadComponent: () => import ('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'flights',
        loadComponent: () => import ('./components/flights/flights.component').then(m => m.FlightsComponent)
    },
    {
        path: 'activities',
        loadComponent: () => import ('./components/activities/activities.component').then(m => m.ActivitiesComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import ('./components/settings/settings.component').then(m => m.SettingsComponent)
    },
{
        path: 'favorites',
        loadComponent: () => import ('./components/favorites/favorites.component').then(m => m.FavoritesComponent)
    },

    { path: '**', redirectTo: 'login' }
];
