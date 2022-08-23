import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusquedaGIF, Gif } from '../interfaces/gifs-interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'y6gzm8NDfTZsaqu2Wtk3c0Ekgbhp3afF';
  private _historial: string[] = [];
  private serviceURL: string = 'https://api.giphy.com/v1/gifs'

  public resultados: Gif[] = [];

  get historial() {
    return[...this._historial];
  }

  constructor(private http: HttpClient) {

    if(localStorage.getItem('historial')) {
      this._historial = JSON.parse( localStorage.getItem('historial')! )
    }

    if(localStorage.getItem('resultado')) {
      this.resultados = JSON.parse( localStorage.getItem('resultado')! )
    }

  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial))
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query)

    this.http.get<BusquedaGIF>(`${this.serviceURL}/search`, {params: params})
      .subscribe( (resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultado', JSON.stringify(this.resultados));
      } )
    
  }

}
