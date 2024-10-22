import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Asistencia } from "../../Objects/Asistencia";

@Injectable({
  providedIn: 'root'
})
export class ApiAssistance{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/Asistencias/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  asistencia(asistencia: Asistencia){
    return this.http.post(`${this.url}asistencia.php`, JSON.stringify(asistencia));
  }

  get(){
    return this.http.get(`${this.url}selectAsistencia.php`);
  }

}
