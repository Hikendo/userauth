import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb= inject(FormBuilder);

  private loginService: AuthService= inject(AuthService);
  private router= inject(Router);

  public myForm: FormGroup= this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  login(){
    const {email, password} = this.myForm.value;
    this.loginService.login(email, password)
    .subscribe( {
      next: ()=>this.router.navigateByUrl('/dashboard'),
      error: (error)=>{
        //console.log({loginError: error}); como es un string mejor lo mandamos en un alert
        Swal.fire('Error: ', error, 'error')
      }
    } )

  }
}
