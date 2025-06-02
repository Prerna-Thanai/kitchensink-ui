import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Member } from '../../models/member.model';
import { Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  constructor(private userService: UserService, private router: Router, private loaderService: LoaderService) {}

  canLoad(): Observable<boolean> {
    // this.loaderService.show();
    return this.userService.getUser().pipe(
      map((res: Member) => {
        if (res && res.roles && res.roles.includes('ADMIN')) {
          return true;
        }
        this.router.navigate(['/login'], {
          state: { errorMessage: 'Access denied' },
        });
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login'], {
          state: { errorMessage: 'Access denied' },
        });
        return of(false);
      })
    );
  }
}