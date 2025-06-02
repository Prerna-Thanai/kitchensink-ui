import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getUser().pipe(
      map(user => {
        if (user) {
          return true;
        }
        this.router.navigate(['/login'], {
          state: { errorMessage: 'Please login' },
        });
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login'], {
          state: { errorMessage: 'Please login' },
        });
        return of(false);
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.canActivate();
  }
}