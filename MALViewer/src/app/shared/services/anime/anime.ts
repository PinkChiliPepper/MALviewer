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

  async getCurrentSeasonSchedule(): Promise<Partial<Record<BroadCastDays, Signal<AnimeItem[]>>>> {
    let currentSeasonSchedules: Partial<Record<keyof typeof BroadCastDays, Signal<AnimeItem[]>>> = {}

    const days: BroadCastDays[] = Object.values(BroadCastDays);

    for (const day of days) {
      const schedule$ = this.currentSeasonSchedule(day);
      currentSeasonSchedules[day as keyof typeof BroadCastDays] = (
        toSignal(schedule$, { initialValue: [] }));
      await this.delay(1000);
    }

    return currentSeasonSchedules
  }

  private currentSeasonScheduleCache = new Map<BroadCastDays, Observable<AnimeItem[]>>();
  private currentSeasonSchedule(day: BroadCastDays): Observable<AnimeItem[]> {
    if (!this.currentSeasonScheduleCache.has(day)) {
      const params = new HttpParams()
        .append('day', day)
        .append('kids', 'false');

      const schedule$ = this.http.get<{ data: AnimeItem[] }>(
        `${this.baseUrl}/schedules`,
        { params }
      ).pipe(
        retry(3),
        map(response => this.filterUniqueByMalId(response.data)),
        // shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
      );
      this.currentSeasonScheduleCache.set(day, schedule$);
    }
    return this.currentSeasonScheduleCache.get(day)!;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private filterDay(items: AnimeItem[], day: string): AnimeItem[] {
    const dayItems = items.filter(item => item.broadcast.day === day);
    return dayItems;
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

}
