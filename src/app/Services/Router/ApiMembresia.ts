import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Membresia } from "src/app/Objects/Membresia";

@Injectable({
  providedIn:'root'
})

export class ApiMembresia{

  url:String = "http://localhost:8080/phpAngular/Gimnasio/";

  constructor(private http:HttpClient, private cookies:CookieService){}

  get(): Observable<Membresia[]>{
    return this.http.get<Membresia[]>(`${this.url}Membresia/selectMembresia.php`);
  }

  insert(membresia:Membresia){
    return this.http.post(`${this.url}Membresia/insertMembresia.php`, JSON.stringify(membresia));
  }

  update(membresia:Membresia){
    return this.http.put(`${this.url}Membresia/updateMembresia.php`, JSON.stringify(membresia));
  }

  updateLote(membresia:Membresia[]){
    return this.http.put(`${this.url}Membresia/updateMembresias.php`, JSON.stringify(membresia));
  }

}
