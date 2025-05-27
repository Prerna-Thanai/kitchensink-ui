import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, RegisterMemberDto } from '../models/member.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private registerUrl = environment.registerUrl;
    private loginUrl = environment.loginUrl;
    private refreshTokenUrl = environment.refreshTokenUrl;

    constructor(private http: HttpClient, private router: Router) {}

    register(registerRequest: RegisterMemberDto): Observable<any> {
        return this.http.post(`${this.registerUrl}`, registerRequest, { withCredentials: true });
      }

    login(loginRequest: LoginRequest): Observable<any> {
      return this.http.post(`${this.loginUrl}`, loginRequest, { withCredentials: true });
    }

    refreshToken(): Observable<any> {
      return this.http.post(`${this.refreshTokenUrl}`, {}, { withCredentials: true });
    }

  checkAndRefreshTokenIfNeeded(): Promise<boolean> {
  const now = Date.now();
  const accessExpiry = parseInt(localStorage.getItem('access_token_expiry_at') || '0', 10);
  const refreshExpiry = parseInt(localStorage.getItem('refresh_token_expiry_at') || '0', 10);

  // Refresh token expired: reject immediately
  if (now > refreshExpiry) {
    return Promise.resolve(false);
  }

  // Access token expired or about to expire in 5 mins => refresh
  if (now > accessExpiry - 5 * 60 * 1000) {
    return new Promise((resolve) => {
      this.refreshToken().subscribe({
        next: (res) => {
          if (res.accessTokenExpiry && res.refreshTokenExpiry) {
            const updatedNow = Date.now();
            localStorage.setItem('access_token_expiry_at', (updatedNow + res.accessTokenExpiry).toString());
            localStorage.setItem('refresh_token_expiry_at', (updatedNow + res.refreshTokenExpiry).toString());
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: () => resolve(false)
      });
    });
  }

  // Tokens valid, no refresh needed
  return Promise.resolve(true);
}



}