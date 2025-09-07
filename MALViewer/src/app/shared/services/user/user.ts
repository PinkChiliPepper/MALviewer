import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimeItem, BroadCastDays } from '@shared/services/anime/types';
import { cacheForFiveMinutes, retryOn429 } from '@shared/services/rxjs-operators';
import { UserAnimeItem, UserHistoryAPI, UserUpdatesAPI } from '@shared/services/user/types';
import { catchError, expand, map, Observable, of, reduce, retry, retryWhen, shareReplay, throwError, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  private baseUrl = 'https://api.jikan.moe/v4';
  private username = 'PinkChiliPepper'
  private userUpdates$?: Observable<UserAnimeItem[]>;

  getUserUpdates(): Observable<UserAnimeItem[]> {
    if (!this.userUpdates$) {
      return this.http.get<{ data: UserUpdatesAPI }>(`${this.baseUrl}/users/${this.username}/userupdates`).pipe(
        map(response => response.data.anime),
        cacheForFiveMinutes(),
        retryOn429(5),
      );
    }
    return this.userUpdates$;
  }

}
