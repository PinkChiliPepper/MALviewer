import { HttpClient, HttpParams } from '@angular/common/http';
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
  private userUrl = 'https://malviewer.onrender.com';
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

  private userAnimeList$?: Observable<UserAnimeItem[]>;
  getUserAnimelist(): Observable<UserAnimeItem[]> {
    if (!this.userAnimeList$) {
      const token = localStorage.getItem('access_token');
      const params = new HttpParams()
        .append('status', 'watching')
        .append('sort', 'list_updated_at')

      return this.http.get<any>(`${this.userUrl}/users/${this.username}/animelist`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).pipe(
        map(response => response.data),
        cacheForFiveMinutes(),
        retryOn429(5),
      )
    }
    return this.userAnimeList$;
  }

  private userPlanToWatch$?: Observable<UserAnimeItem[]>;
  getUserPlanToWatch(): Observable<UserAnimeItem[]> {
    const params = new HttpParams()
        .append('status', 'plan_to_watch')
        .append('sort', 'list_updated_at')

    if (!this.userPlanToWatch$) {
      const token = localStorage.getItem('access_token');
      return this.http.get<any>(`${this.userUrl}/users/${this.username}/animelist`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).pipe(
        map(response => response.data),
        cacheForFiveMinutes(),
        retryOn429(5),
      )
    }
    return this.userPlanToWatch$;
  }

  private userCompleted$?: Observable<UserAnimeItem[]>;
  getUserCompleted(): Observable<UserAnimeItem[]> {
     const params = new HttpParams()
        .append('status', 'completed')
        .append('sort', 'list_updated_at')

    if (!this.userCompleted$) {
      const token = localStorage.getItem('access_token');
      return this.http.get<any>(`${this.userUrl}/users/${this.username}/animelist`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).pipe(
        map(response => response.data),
        cacheForFiveMinutes(),
        retryOn429(5),
      )
    }
    return this.userCompleted$;
  }

}
