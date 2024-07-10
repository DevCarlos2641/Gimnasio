import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Usuario } from "src/app/Objects/Usuario";

@Injectable({
  providedIn:'root'
})

export class ApiUsuario{
  url:String = "http://localhost:8080/phpAngular/Gimnasio/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}selectUsuario.php`);
  }

  insert(usuario:Usuario){
    return this.http.post(`${this.url}insertUsuario.php`, JSON.stringify(usuario));
  }

  update(usuario:Usuario){
    return this.http.put(`${this.url}updateUsuario.php`, JSON.stringify(usuario));
  }
}
