import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  private authService= inject(AuthService)
///Podemos usar un get para obtener el currentUser de nuestro servicio
  /*get user(){
   return this.authService.currentUser();
  }*/

  //Aun mejor si usamos una signal computada
  public user= computed(()=>this.authService.currentUser());

  logout(){
    this.authService.logout();
  }

}
