import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserAnimeItem, UserUpdatesAPI } from '@app/shared/services/user/types';
import { cacheForFiveMinutes, retryOn429 } from '@app/shared/services/rxjs-operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  private baseUrl = 'https://api.jikan.moe/v4';
  private username = 'PinkChiliPepper'
  private userUpdates$?: Observable<UserAnimeItem[]>;
  private userAnimeList$?: Observable<UserAnimeItem[]>;

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

  getUserAnimelist(): Observable<UserAnimeItem[]> {
    const username = 'PinkChiliPepper'
    if (!this.userAnimeList$) {
      const token = localStorage.getItem('access_token');
      return this.http.get<any>(`http://localhost:3000/users/${username}/animelist?status=watching`, {
        headers: { Authorization: `Bearer ${token}` }
      }).pipe(
        map(response => response.data),
        cacheForFiveMinutes(),
        retryOn429(5),
      )
    }
    return this.userAnimeList$;
  }

}
