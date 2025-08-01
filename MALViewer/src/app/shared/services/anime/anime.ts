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
    return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/top/anime`).pipe(
      map(response => this.filterUniqueByMalId(response.data))
    );
  }

  getCurrentSeason(): Observable<AnimeItem[]> {
    return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/seasons/now`).pipe(
      map(response => this.filterUniqueByMalId(response.data))
    );
  }

  private filterUniqueByMalId(items: AnimeItem[]): AnimeItem[] {
    const seen = new Set<number>();
    return items.filter(item => {
      if (seen.has(item.mal_id)) return false;
      seen.add(item.mal_id);
      return true;
  });

  }

}
