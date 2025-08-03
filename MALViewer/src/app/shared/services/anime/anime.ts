import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimeItem } from '@shared/services/anime/types';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Anime {

  constructor(private http: HttpClient) {}

  private baseUrl = 'https://api.jikan.moe/v4';
  private topAnime$?: Observable<AnimeItem[]>;
  private currentSeason$?: Observable<AnimeItem[]>;

  getTopAnime(): Observable<AnimeItem[]> {
    if (!this.topAnime$) {
      this.topAnime$ = this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/top/anime`).pipe(
        map(response => this.filterUniqueByMalId(response.data)),
        shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
      );
    }
    return this.topAnime$;
  }
  getCurrentSeason(): Observable<AnimeItem[]> {
    if (!this.currentSeason$) {
      return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/seasons/now`).pipe(
        map(response => this.filterUniqueByMalId(response.data)),
        shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
      );
    }
    return this.currentSeason$;
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
