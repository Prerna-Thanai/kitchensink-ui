import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, RegisterMemberDto } from '../models/member.model';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


    private registerUrl = environment.registerUrl;
    private loginUrl = environment.loginUrl;
    private refreshTokenUrl = environment.refreshTokenUrl;
    private logoutUrl = environment.logoutUrl;
    private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private authState$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

    register(registerRequest: RegisterMemberDto): Observable<any> {
        return this.http.post(`${this.registerUrl}`, registerRequest, { withCredentials: true });
      }

    login(loginRequest: LoginRequest): Observable<any> {
      return this.http.post(`${this.loginUrl}`, loginRequest, { withCredentials: true });
    }

    refreshToken(): Observable<any> {
      console.log("Refreshing token...");
      return this.http.post(`${this.refreshTokenUrl}`, {}, { withCredentials: true });
    }

  checkAndRefreshTokenIfNeeded(): Promise<boolean> {
    const now = Date.now();
    const accessToken = this.cookieService.get('access_token');
    const refreshExpiry = parseInt(localStorage.getItem('refresh_token_expiry_at') || '0', 10);
    const accessExpiry = parseInt(localStorage.getItem('access_token_expiry_at') || '0', 10);


    console.log('checkAndRefreshTokenIfNeeded called.');
    console.log('Current time:', now);
    console.log('Access Token exists:', !!accessToken);
    console.log('Refresh Token exists:', !!this.cookieService.get('refresh_token')); // Check directly from cookie
    console.log('Access Expiry (ms):', accessExpiry);
    console.log('Refresh Expiry (ms):', refreshExpiry);

    // Scenario 1: No refresh token found at all (or it's just expired)
    if (!this.cookieService.get('refresh_token') || now > refreshExpiry) {
      console.log('No valid refresh token found or it is expired. User needs to log in.');
      this.clearAuthTokens();
      return Promise.resolve(false);
    }

    // Scenario 2: Access token exists, check its expiry
    if (accessToken) {
      console.log('Access token found. Checking its expiry...');
      // If access token is valid and not near expiry
      if (now < accessExpiry - 5 * 60 * 1000) {
        console.log('Access token is valid and not near expiry. No refresh needed.');
        return Promise.resolve(true); // Tokens are good
      } else {
        // Access token is expired or about to expire in 5 mins => refresh
        console.log('Access token expired or near expiry. Attempting to refresh...');
        return this.executeRefreshTokenRequest(); // Call the extracted common method
      }
    } else {
      // Scenario 3: No access token found, but refresh token exists and is valid.
      console.log('No access token found, but refresh token exists and is valid. Attempting to refresh...');
      return this.executeRefreshTokenRequest(); // Call the extracted common method
    }
  }

  // Common method for executing the refresh token API call and handling its outcome
  // This method encapsulates the repeated subscribe logic
  private executeRefreshTokenRequest(): Promise<boolean> {
    return new Promise((resolve) => {
      this.refreshToken().subscribe({
        next: (res: { accessToken?: string; refreshToken?: string; accessTokenExpiry: number; refreshTokenExpiry: number }) => {
          console.log('Token refresh API call succeeded.');
          if (res.accessTokenExpiry && res.refreshTokenExpiry) {
            const updatedNow = Date.now();
            localStorage.setItem('access_token_expiry_at', (updatedNow + res.accessTokenExpiry).toString());
            localStorage.setItem('refresh_token_expiry_at', (updatedNow + res.refreshTokenExpiry).toString());

            // IMPORTANT: If your backend returns new tokens in the response body, set them here:
            if (res.accessToken) {
              this.cookieService.set('access_token', res.accessToken, undefined, '/', undefined, true, 'Lax');
            }
            if (res.refreshToken) {
              this.cookieService.set('refresh_token', res.refreshToken, undefined, '/', undefined, true, 'Lax');
            }
            resolve(true); // Refresh successful
          } else {
            console.warn('Refresh token response missing expiry details. Response:', res);
            this.clearAuthTokens(); // If response is bad, clear tokens
            resolve(false);
          }
        },
        error: (err) => {
          console.error('Refresh token API call failed:', err);
          this.clearAuthTokens(); // Clear tokens on refresh failure
          resolve(false); // Refresh failed
        }
      });
    });
  }

  // Helper function to clear all relevant tokens
  private clearAuthTokens(): void {
    console.log('Clearing all authentication tokens.');
    this.cookieService.delete('access_token', '/'); // Delete from root path
    this.cookieService.delete('refresh_token', '/'); // Delete from root path
    localStorage.removeItem('access_token_expiry_at');
    localStorage.removeItem('refresh_token_expiry_at');
    // Optionally: Redirect to login page or emit an event for logout
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Handling 401 error, attempting to refresh token...');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(false);

      return this.refreshToken().pipe(
        tap(() => this.refreshTokenSubject.next(true)),
        switchMap(() => next.handle(req.clone({ withCredentials: true }))),
        catchError(err => {
          this.refreshTokenSubject.next(false);
          return throwError(() => err);
        }),
        tap(() => this.isRefreshing = false)
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(refreshed => refreshed === true),
        take(1),
        switchMap(() => next.handle(req.clone({ withCredentials: true })))
      );
    }
  }

  initAuthState(): void {
    this.http.get('http://localhost:8080/api/auth/check', { withCredentials: true }).subscribe({
      next: () => this.authState$.next(true),
      error: () => this.authState$.next(false)
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  verifyToken(): Observable<any> {
  return this.http.get('http://localhost:8080/api/auth/check', { withCredentials: true });
}

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { withCredentials: true });
  }



}