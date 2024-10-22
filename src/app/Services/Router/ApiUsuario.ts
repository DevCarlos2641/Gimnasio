import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { ResponsePhp } from "../../Objects/Interfacez";
import { Usuario } from "../../Objects/Usuario";

@Injectable({
  providedIn:'root'
})

export class ApiUsuario{

  private url:string = "http://localhost:8080/phpAngular/Gimnasio/Usuario/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}get.php`, {headers: this.headers()});
  }

  insert(usuario:Usuario): Observable<ResponsePhp>{
    return this.http.post<ResponsePhp>(`${this.url}insert.php`, JSON.stringify(usuario), {headers: this.headers()});
  }

  update(usuario:Usuario): Observable<ResponsePhp>{
    return this.http.put<ResponsePhp>(`${this.url}update.php`, JSON.stringify(usuario), {headers: this.headers()});
  }

  headers():HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.cookies.get('token')
    });
  }
}
