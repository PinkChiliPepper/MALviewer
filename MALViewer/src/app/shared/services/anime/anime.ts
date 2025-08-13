import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnimeItem, BroadCastDays } from '@shared/services/anime/types';
import { map, Observable, retry, shareReplay } from 'rxjs';


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
        map(response => this.filterAnime(response.data)),
        shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
      );
    }
    return this.topAnime$;
  }

  getCurrentSeason(): Observable<AnimeItem[]> {
    if (!this.currentSeason$) {
      return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/seasons/now`).pipe(
        map(response => this.filterAnime(response.data)),
        shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
      );
    }
    return this.currentSeason$;
  }

  private currentSeasonScheduleCache = new Map<BroadCastDays, Observable<AnimeItem[]>>();
  getCurrentSeasonSchedule(day: BroadCastDays): Observable<AnimeItem[]> {
    if (!this.currentSeasonScheduleCache.has(day)) {
      const params = new HttpParams()
        .append('day', day)
        // .append('kids', 'false');

      const schedule$ = this.http.get<{ data: AnimeItem[] }>(
        `${this.baseUrl}/schedules`,
        { params }
      ).pipe(
        retry(3),
        map(response => this.filterAnime(response.data)),
        shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
      );
      this.currentSeasonScheduleCache.set(day, schedule$);
    }
    return this.currentSeasonScheduleCache.get(day)!;
  }

  private filterAnime(items: AnimeItem[]): AnimeItem[] {
    return this.filterByScore(this.filterUniqueByMalId(items));
  }

  private filterUniqueByMalId(items: AnimeItem[]): AnimeItem[] {
    const seen = new Set<number>();
    const uniqueItems = items.filter(item => {
      if (seen.has(item.mal_id)) return false;
      seen.add(item.mal_id);
      return true;
    });

    uniqueItems.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return uniqueItems;
  }

  private filterByScore(items: AnimeItem[]): AnimeItem[] {
    const filteredByScore = items.filter(item => (item.score ?? 0) > 6);
    filteredByScore.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return filteredByScore;
  }

}
