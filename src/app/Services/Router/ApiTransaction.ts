import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Transaccion } from "src/app/Objects/Transaccion";

@Injectable({
  providedIn: 'root'
})
export class ApiTransaction{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(){
    return this.http.get(`${this.url}selectTransaccion.php`);
  }

  insert(transaccion:Transaccion){
    if(transaccion.idUsuario === undefined)
      transaccion.idUsuario = -1;
    return this.http.post(`${this.url}insertTransaccion.php`, JSON.stringify(transaccion));
  }

}
