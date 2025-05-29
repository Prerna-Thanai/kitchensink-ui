import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const SKIP_URLS = ['/login', '/register'];
  const isSkipped = SKIP_URLS.some(url => state.url.includes(url));
  if (isSkipped) return true;
  console.log(1);

  // Async check to verify token and refresh if needed
  return authService.isAuthenticated().pipe(
    take(1),
    map(isAuth => {
      if(isAuth){
        console.log('User is authenticated');
        return true;
      }else{
        console.log('User is not authenticated, redirecting to login');
        return router.createUrlTree(['/login']);
      }
      // isAuth ? true : router.createUrlTree(['/login'])
    })
  );
  
};
