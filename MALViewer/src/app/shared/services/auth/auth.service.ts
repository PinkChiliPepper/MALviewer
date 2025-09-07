// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private clientId = environment.MALClientId;
  private redirectUri = `${environment.baseUrl}/mal-auth/callback`;
  private codeVerifier = '';

  // https://myanimelist.net/apiconfig/references/api/v2#section/Authentication
  private mainAuth = 'https://myanimelist.net/v1/oauth2/authorize';

  private _user = signal<any | null>(null);
  user = this._user.asReadonly();

  constructor(private http: HttpClient) {}

  // https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
  private generateCodeVerifier(length = 96) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let random = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      random += charset[array[i] % charset.length];
    }
    return random;
  }

  async login() {
    this.codeVerifier = this.generateCodeVerifier();
    localStorage.setItem('pkce_verifier', this.codeVerifier);
    console.log(this.codeVerifier)
    const codeChallenge = this.codeVerifier;

    const authUrl = `${this.mainAuth}?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=plain`;

    window.location.href = authUrl;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._user.set(null);
  }

  fetchUserInfo() {
    const token = localStorage.getItem('access_token');
    this.http.get<any>('http://localhost:3000/user', { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      (user) => {
        this._user.set(user);
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  fetchUserAnimelist(username: string) {
    const token = localStorage.getItem('access_token');
    return this.http.get<any>(`http://localhost:3000/users/${username}/animelist?status=watching`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  exchangeCodeForToken(code: string) {
  const verifier = localStorage.getItem('pkce_verifier') ?? '';
  const body = { code, code_verifier: verifier };

  this.http.post<any>('http://localhost:3000/auth/exchange', body).subscribe(
    (tokens) => {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      this.fetchUserInfo();
    },
    (error) => {
      console.error('Error exchanging code for token', error);
    }
  );
}
}
