import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAunthenticatedGuard: CanActivateFn = (route, state) => {

 //const url= state.url;
 //localStorage.setItem('url',url);
  //console.log('Guard is Aunthenticated')
  //console.log({route, state})
  //Injectamops el servico para saber si estamos autenticados

  const authService= inject(AuthService);
  if (authService.authStatus()=== AuthStatus.checking) {
    return false;

  }
  if (authService.authStatus()=== AuthStatus.authenticated) {
    return true;

  }
  const router= inject(Router);
  router.navigateByUrl('/auth/login')

  return false;
};
