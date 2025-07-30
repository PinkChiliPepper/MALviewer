import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimeItem } from '@shared/services/anime/types';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Anime {
  private baseUrl = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}

  getTopAnime(): Observable<AnimeItem[]> {
    console.log('!!')
    return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/top/anime`).pipe(
      map(response => response.data)
    );
  }

  getCurrentSeason(): Observable<AnimeItem[]> {
    console.log('!!')
    return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/seasons/now`).pipe(
      map(response => response.data)
    );
  }

}
