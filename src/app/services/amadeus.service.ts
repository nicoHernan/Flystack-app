import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AmadeusService {
    private http = inject(HttpClient);
    private accessToken: string | null = null;
    private tokenExpiration: number = 0;

    private async getAccessToken(): Promise<string> {
      const now = Date.now();

      if (this.accessToken && now < this.tokenExpiration - 10000) {
        console.log('Reutilizando token de Amadeus existente...');
        return this.accessToken;
      }
    console.log('El token venció o es la primera vez. Pidiendo uno nuevo...');

    const payload = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', environment.amadeus.clientId)
      .set('client_secret', environment.amadeus.clientSecret);

      const response: any = await firstValueFrom(
      this.http.post('https://test.api.amadeus.com/v1/security/oauth2/token', payload)
    );

    this.accessToken = response.access_token;
    this.tokenExpiration = Date.now() + (response.expires_in * 1000);
    return response.access_token;
    }

    async getFlightOffers(origin: string, destination: string, date: string, returnDate: string) {
    const token = await this.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const params = new HttpParams()
      .set('originLocationCode', origin)
      .set('destinationLocationCode', destination)
      .set('departureDate', date)
      .set('returnDate', returnDate)
      .set('adults', '1')
      .set('max', '10'); 

    return firstValueFrom(
      this.http.get('https://test.api.amadeus.com/v2/shopping/flight-offers', { headers, params })
    );
  }
}