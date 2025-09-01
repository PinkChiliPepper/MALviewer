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
  private tokenEndpoint = 'https://myanimelist.net/v1/oauth2/token';
  private mainAuth = 'https://myanimelist.net/v1/oauth2/authorize';

  private _user = signal<any | null>(null);
  user = this._user.asReadonly();

  constructor(private http: HttpClient) {}

  // https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
  private generateCodeVerifier(length = 128) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let random = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      random += charset[array[i] % charset.length];
    }
    return random;
  }

  // https://datatracker.ietf.org/doc/html/rfc7636#section-4.2
  private async generateCodeChallenge(verifier: string) {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async login() {
    this.codeVerifier = this.generateCodeVerifier();
    localStorage.setItem('pkce_verifier', this.codeVerifier);
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

    const authUrl = `${this.mainAuth}?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.location.href = authUrl;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._user.set(null);
  }

  fetchUserInfo(token: string) {
    this.http.get('https://api.myanimelist.net/v2/users/@me', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    }).subscribe(user => {
      this._user.set(user);
      console.log(user)
    });
  }

  exchangeCodeForToken(code: string) {
    const body = new URLSearchParams();
    const verifier = localStorage.getItem('pkce_verifier') ?? '';
    console.log(verifier)
    body.set('client_id', this.clientId);
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('code_verifier', verifier);

    return this.http.post<any>(this.tokenEndpoint, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).subscribe(tokens => {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      this.fetchUserInfo(tokens.access_token);
    });
  }
}
