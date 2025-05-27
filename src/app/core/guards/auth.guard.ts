import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAndRefreshTokenIfNeeded().then(isValid => {
    if (isValid) {
      return true;
    }
    return router.createUrlTree(['/login']);
  });
};

