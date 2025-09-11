import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimeItem, BroadCastDays } from '@app/shared/services/anime/types';
import { cacheForFiveMinutes, retryOn429 } from '@app/shared/services/rxjs-operators';
import { catchError, expand, map, Observable, of, reduce, retry, retryWhen, shareReplay, throwError, timer } from 'rxjs';


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
      const firstPageUrl = `${this.baseUrl}/top/anime?page=1`;

      this.topAnime$ = this.http.get<{ data: AnimeItem[]; pagination: any }>(firstPageUrl).pipe(
        expand((response, i) => {
          const nextPage = response.pagination?.has_next_page && (i + 2 <= 5);
          if (nextPage) {
            return this.http.get<{ data: AnimeItem[]; pagination: any }>(
              `${this.baseUrl}/top/anime?page=${i + 2}`
            ).pipe(retryOn429(5));
          }
          return of();
        }),
        map(response => response.data),
        reduce((all, pageData) => all.concat(pageData), [] as AnimeItem[]),
        map(items => this.filterAnime(items)),
        cacheForFiveMinutes(),
      );
    }

    return this.topAnime$;
  }

  getCurrentSeason(): Observable<AnimeItem[]> {
    if (!this.currentSeason$) {
      return this.http.get<{ data: AnimeItem[] }>(`${this.baseUrl}/seasons/now`).pipe(
        map(response => this.filterAnime(response.data)),
        cacheForFiveMinutes(),
        retryOn429(5),
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
      retryOn429(5),
      map(response => this.filterAnime(this.filterRecent(response.data))),
      cacheForFiveMinutes(),
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
    const startYear = item.aired?.prop.from.year;
    if (!startYear) return false;
    return twoYearsAgo <= startYear;
  });
  }
}
