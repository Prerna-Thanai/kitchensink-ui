import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly SKIP_URLS = ['/login', '/register'];

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isSkipped = this.SKIP_URLS.some(url => req.url.includes(url));
    if (isSkipped) {
      return next.handle(req);
    }

    return from(this.authService.checkAndRefreshTokenIfNeeded()).pipe(
      switchMap((isValid: boolean) => {
        if (!isValid) {
          this.router.navigate(['/login']);
          return throwError(() => new Error('Session expired'));
        }

        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
