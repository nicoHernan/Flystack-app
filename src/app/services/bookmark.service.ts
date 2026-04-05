import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http' ;
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly baseUrl = `${environment.supabase.url}/rest/v1` ;
  private readonly headers = new HttpHeaders({
    'apikey': environment.supabase.key,
    'Authorization': `Bearer ${environment.supabase.key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  })

  constructor(private http: HttpClient) {}

  async createProfile(user: any) {
    const profileData = {
      firebase_id: user.uid, 
      email: user.email,
      display_name: user.displayName,
      avatar_url: user.photoURL
    };
  
    const upsertHeaders = this.headers.set('Prefer', 'resolution=merge-duplicates,return=representation');
    try {
      return await firstValueFrom(
        this.http.post(`${this.baseUrl}/profiles`, profileData, { headers: upsertHeaders })
      );
    } catch (error) {
      console.error('Error en Supabase Upsert:', error);
      throw error;
    }
  }

  async saveFlight(flight: any, userId: string) {
    const flightData = {
        user_id: userId,
        origin_code: flight.itineraries[0].segments[0].departure.iataCode,
        destination_code: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode,
        departure_date: flight.itineraries[0].segments[0].departure.at,
        return_date: flight.itineraries[1] ? flight.itineraries[1].segments[0].departure.at : null ,
        price_total: flight.price.total,
        currency: flight.price.currency,
        airline_code: flight.validatingAirlineCodes[0],
        flight_offer_raw: flight
    }

    try {
      const data = await firstValueFrom(
        this.http.post(`${this.baseUrl}/saved_flights`, flightData, { headers: this.headers })
      );
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getSavedFlights(userId: string) {
    const params = new HttpParams()
      .set('user_id', `eq.${userId}`)
      .set('order', 'created_at.desc');

    try {
      const data = await firstValueFrom(
        this.http.get<any[]>(`${this.baseUrl}/saved_flights`, { headers: this.headers, params })
      );
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async deleteFlight(flightId: any) {
   const params = new HttpParams().set('flight_id', `eq.${flightId}`);
    
    try {
      const data = await firstValueFrom(
        this.http.delete(`${this.baseUrl}/saved_flights`, { headers: this.headers, params })
      );
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async checkIfFavorite(userId: string, flight: any) {
    const params = new HttpParams()
      .set('select', 'flight_id')
      .set('user_id', `eq.${userId}`)
      .set('origin_code', `eq.${flight.itineraries[0].segments[0].departure.iataCode}`)
      .set('destination_code', `eq.${flight.itineraries[0].segments[0].arrival.iataCode}`)
      .set('departure_date', `eq.${flight.itineraries[0].segments[0].departure.at}`)
      .set('price_total', `eq.${flight.price.total}`);

    try {
      const data = await firstValueFrom(
        this.http.get<any[]>(`${this.baseUrl}/saved_flights`, { headers: this.headers, params })
      );
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}
