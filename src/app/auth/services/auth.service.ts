import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseurl: string= environment.baseUrl;
  private http= inject(HttpClient);
//creamos un signal para obtener nuestro usuario actual y nuestro estatus
  private _currentUser= signal<User | null>(null);
  private _authStatus= signal<AuthStatus>(AuthStatus.checking);

  //con esto exponemos los datos fuera del servico, pero nos aseguramos de que no sean modificados desde el exterior
  public currentUser= computed(()=> this._currentUser);
  public authStatus= computed(()=> this._authStatus)
  constructor() { }

  login(email: string, password: string): Observable<boolean>{
    const url=`${this.baseurl}/auth/login`;
    //con ecma Script 6 recortamos a {email,  password}, lo dejo asi por legibilidad para mi
    const body = {email: email, password: password};

    return this.http.post<LoginResponse>( url , body )
    .pipe(
      tap(({user , token})=> {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        console.log({user, token});
      }
    ),
    map(()=> true),
    //atraparemos todos los errores
    catchError(err=> {
        console.log(err);
        return throwError(()=> 'Ocurrio un error inesperado');
    })
    );
  }
}
