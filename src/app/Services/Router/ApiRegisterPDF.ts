import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { RegistroPdf } from "src/app/Objects/RegistroPdf";

@Injectable({
  providedIn: 'root'
})
export class ApiRegisterPDF{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(){
    return this.http.get(`${this.url}selectRegistrosPdf.php`);
    //return this.httpClient.get(`${this.url}RegistrosPDF`);
  }



  insert(registroPdf:RegistroPdf){
    return this.http.post(`${this.url}insertRegistrosPdf.php`, JSON.stringify(registroPdf));
    //return this.httpClient.post(`${this.url}InsertRegistrosPdf`, registroPdf);
  }

}
