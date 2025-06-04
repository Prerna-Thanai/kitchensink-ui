import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly SKIP_URLS = ['/login', '/register','/assets/'];
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isSkipped = this.SKIP_URLS.some(url => req.url.includes(url));
    if (isSkipped) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.log(error);
        this.router.navigate(['/login'], {
            state: { errorMessage: error?.error?.message || 'Unauthorized access' }
        });
        }
        return throwError(() => error);
      })
    );

  }

  // handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(false);

  //     return this.authService.refreshToken().pipe(
  //       tap(() => this.refreshTokenSubject.next(true)),
  //       switchMap(() => next.handle(req.clone({ withCredentials: true }))),
  //       catchError(err => {
  //         this.refreshTokenSubject.next(false);
  //         return throwError(() => err);
  //       }),
  //       tap(() => this.isRefreshing = false)
  //     );
  //   } else {
  //     return this.refreshTokenSubject.pipe(
  //       filter(refreshed => refreshed === true),
  //       take(1),
  //       switchMap(() => next.handle(req.clone({ withCredentials: true })))
  //     );
  //   }
  // }
}
