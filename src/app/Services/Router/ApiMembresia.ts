import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { ResponsePhp } from "../../Objects/Interfacez";
import { Membresia } from "../../Objects/Membresia";

@Injectable({
  providedIn:'root'
})

export class ApiMembresia{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/Membresia/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(): Observable<Membresia[]>{
    return this.http.get<Membresia[]>(`${this.url}get.php`, {headers: this.headers()});
  }

  insert(membresia:Membresia): Observable<ResponsePhp>{
    return this.http.post<ResponsePhp>(`${this.url}insert.php`, JSON.stringify(membresia), {headers: this.headers()});
  }

  update(membresia:Membresia): Observable<ResponsePhp>{
    return this.http.put<ResponsePhp>(`${this.url}update.php`, JSON.stringify(membresia), {headers: this.headers()});
  }

  updateLote(membresia:Membresia[]){
    return this.http.put(`${this.url}updateByLote.php`, JSON.stringify(membresia), {headers: this.headers()});
  }

  headers():HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.cookies.get('token')
    });
  }

}
