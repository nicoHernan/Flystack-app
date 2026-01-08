import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js' ;
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(){
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }

  async createProfile(user: any) {
    const profileData = {
      firebase_id: user.uid, 
      email: user.email,
      display_name: user.displayName,
      avatar_url: user.photoURL
    };
  
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert(profileData);

    if (error){
      console.error('Error en Supabase Upsert:', error);
      throw error;
    } 
    return data;
  }

  async saveFlight(flight: any, userId: string) {
    const { data, error } = await this.supabase
      .from('saved_flights')
      .insert({
        user_id: userId,
        origin_code: flight.itineraries[0].segments[0].departure.iataCode,
        destination_code: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode,
        departure_date: flight.itineraries[0].segments[0].departure.at,
        price_total: flight.price.total,
        currency: flight.price.currency,
        airline_code: flight.validatingAirlineCodes[0],
        flight_offer_raw: flight
      });

    if (error) throw error;
    return data;
  }
}
