import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const CACHE_DURATION = 60_000; // 1 minute cache

let lastCheckTime = 0;
let lastResult = false;

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const now = Date.now();

  if (now - lastCheckTime < CACHE_DURATION && lastResult) {
    // Return cached result immediately
    return of(true);
  }

  return authService.authCheck().pipe(
    map(() => {
      lastCheckTime = now;
      lastResult = true;
      return true;
    }),
    catchError(() => {
      lastCheckTime = now;
      lastResult = false;
      router.navigateByUrl('/login');
      return of(false);
    })
  );
};
