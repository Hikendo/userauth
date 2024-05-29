import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, retry, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

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
  public currentUser= computed(()=> this._currentUser());
  public authStatus= computed(()=> this._authStatus())

  constructor(){
    this.checkAuthStatus().subscribe();
  }

  //DRY
  private successAuthentication(user: User, token: string): boolean {
            //si sale bien establecemos el usuario, el estatus y guardamos el token en el local storage

    this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
      return true;
  }

  login(email: string, password: string): Observable<boolean>{
    const url=`${this.baseurl}/auth/login`;
    //con ecma Script 6 recortamos a {email,  password}, lo dejo asi por legibilidad para mi
    const body = {email: email, password: password};

    return this.http.post<LoginResponse>( url , body )
    .pipe(
      map(({user , token})=> this.successAuthentication(user,token) ),

    //atraparemos todos los errores
    catchError(err=> throwError(()=> err.error.message ) )
    );
  }
  checkAuthStatus():Observable<boolean>{

    //nuestra ruta del endpoint para revisar el token
    const url = `${ this.baseurl }/auth/check-token`;
    //obtener el valor del token
    const token= localStorage.getItem('token');
    //si nuestro token no existe salimos y regresamos false
    if(!token) {
      this.logout();
      return of(false);
    }
    //nuestras contantes del header autorizacion y barer para las credenciales del header token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    //mandamos nuestra peticion de tipo get con el token y los headers
    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map(({user , token})=>  this.successAuthentication(user,token) ),
        //console.log(this.currentUser())),
      catchError(()=> {
        this._authStatus.set(AuthStatus.notAuthenticated)
        return of(false)
      }),
    )
  }
  logout(){
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
  }
}
