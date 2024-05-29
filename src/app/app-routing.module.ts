import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAunthenticatedGuard } from './auth/guards/is-aunthenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';

const routes: Routes = [{
  path:'auth',
  canActivate: [isNotAuthenticatedGuard],
      loadChildren: ()=> import('./auth/auth.module').then(m=> m.AuthModule)
    },
    {
      path:'dashboard',
      canActivate: [isAunthenticatedGuard],
      loadChildren: ()=> import('./dashboard/dashboard.module').then(m=> m.DashboardModule)
    },
    {path: '**', redirectTo:'auth'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
