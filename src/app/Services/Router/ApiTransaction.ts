import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Transaccion } from "../../Objects/Transaccion";
import { ResponsePhp } from "../../Objects/Interfacez";

@Injectable({
  providedIn: 'root'
})
export class ApiTransaction{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/Transaccion/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(){
    return this.http.get(`${this.url}get.php`, {headers: this.headers()});
  }

  insert(transaccion:Transaccion): Observable<ResponsePhp>{
    if(transaccion.idUsuario === undefined)
      transaccion.idUsuario = -1;
    return this.http.post<ResponsePhp>(`${this.url}insert.php`, JSON.stringify(transaccion), {headers: this.headers()});
  }

  headers():HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.cookies.get('token')
    });
  }

}
