import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Registros } from "../../Objects/Interfacez";
import { RegistroPdf } from "../../Objects/RegistroPdf";

@Injectable({
  providedIn: 'root'
})
export class ApiRegisterPDF{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/RegisterPdf/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(): Observable<RegistroPdf[]>{
    return this.http.get<RegistroPdf[]>(`${this.url}get.php`, {headers: this.headers()});
  }

  getWhitName(): Observable<Registros[]>{
    return this.http.get<Registros[]>(`${this.url}getWhitName.php`, {headers: this.headers()});
  }

  insert(registroPdf:RegistroPdf){
    return this.http.post(`${this.url}insert.php`, JSON.stringify(registroPdf), {headers: this.headers()});
  }

  headers():HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.cookies.get('token')
    });
  }
}
