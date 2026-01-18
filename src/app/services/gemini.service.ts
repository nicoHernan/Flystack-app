import { Injectable } from "@angular/core";
import { getApp } from "@angular/fire/app";
import {getAI, getGenerativeModel, GoogleAIBackend} from "firebase/ai" ;

@Injectable({
    providedIn: 'root'
})
export class GeminiService{
    private model: any;

    constructor(){
        try{
            const firebaseApp = getApp() ;
            const ai = getAI(firebaseApp, {backend: new GoogleAIBackend()}) ;
            this.model = getGenerativeModel(ai, {model: 'gemini-2.5-flash'}) ;
        
            console.log('Gemini AI Service inicializado correctamente');
        } catch (error) {
        console.error('Error inicializando Firebase AI:', error);
        }
    }

    async getTravelInspiration(city: string, month: string): Promise<string> {
    const prompt = `Actúa como experto en viajes. Estamos en el mes de ${month}. 
                    Analiza el clima de ${city} y justifica en exactamente 5 renglones 
                    por qué es un destino ideal y qué actividades hacer según ese clima.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error al generar contenido:', error);
      return 'Lo siento, no pude obtener inspiración para tu viaje en este momento.';
    }
  }
}
