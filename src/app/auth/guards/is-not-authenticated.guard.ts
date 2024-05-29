import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';
import { inject } from '@angular/core';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService= inject(AuthService);
  if (authService.authStatus()=== AuthStatus.authenticated) {
    return false;

  }

  const router= inject(Router);
  router.navigateByUrl('/dashboard')

  return false;
};
