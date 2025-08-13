import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnimeItem, BroadCastDays } from '@shared/services/anime/types';
import { catchError, map, Observable, retry, retryWhen, shareReplay, throwError, timer } from 'rxjs';


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

  getCurrentSeasonSchedule(day: BroadCastDays): Observable<AnimeItem[]> {
    const params = new HttpParams()
      .append('filter', day)
      .append('kids', 'false');

    const schedule$ = this.http.get<{ data: AnimeItem[] }>(
      `${this.baseUrl}/schedules`,
      { params }
    ).pipe(
      this.retryOn429(5),
      map(response => this.filterAnime(response.data)),
      shareReplay({ bufferSize: 1, refCount: false, windowTime: 5 * 60 * 1000 })
    );
    return schedule$
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
    const filteredByScore = items.filter(item => (item.score ?? 0) > 6.5);
    filteredByScore.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return filteredByScore;
  }

  private filterRecent(items: AnimeItem[]): AnimeItem[] {
  const twoYearsAgo = new Date().getFullYear() - 2;

  return items.filter(item => {
    const startYear = item.aired?.from.year;
    if (!startYear) return false;
    return twoYearsAgo <= startYear;
  });
}

  private retryOn429<T>(maxRetries: number) {
  return (source: Observable<T>) => source.pipe(retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          if (!(error instanceof HttpErrorResponse) || error.status !== 429) {
            return throwError(() => error);
          }

          const retryAfter = error.headers.get('Retry-After');
          if (retryAfter) {
            const retrySec = parseInt(retryAfter, 10);
            if (!isNaN(retrySec)) return timer(retrySec * 1000);
          }
          return timer(2000 * (2 * retryCount));
        }
      }),
      catchError(err => throwError(() => err))
    );
}
}
