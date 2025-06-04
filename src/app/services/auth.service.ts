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
    private authCheckUrl = environment.userUrl;
      private apiKey = environment.phoneapiKey; // Assuming you have this in your environment file
    // private isRefreshing = false;

    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

    register(registerRequest: RegisterMemberDto): Observable<any> {
        return this.http.post(`${this.registerUrl}`, registerRequest, { withCredentials: true });
      }

    login(loginRequest: LoginRequest): Observable<any> {
      return this.http.post(`${this.loginUrl}`, loginRequest, { withCredentials: true });
    }  

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { withCredentials: true });
  }

  authCheck(): Observable<any> {
    return this.http.get(this.authCheckUrl, { withCredentials: true });
  }

  validatePhone(phone: string) {
  return this.http.get('https://phonevalidation.abstractapi.com/v1/?api_key='+ this.apiKey + '&phone=' + phone );
}


}