import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAssistance } from './Router/ApiAssistance';
import { ApiMembresia } from './Router/ApiMembresia';
import { ApiRegisterPDF } from './Router/ApiRegisterPDF';
import { ApiTransaction } from './Router/ApiTransaction';
import { ApiUsuario } from './Router/ApiUsuario';
import { Admon } from '../Objects/Admon';
import { ResponsePhp } from '../Objects/Interfacez';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private httpClient:HttpClient, private cookies:CookieService) { }

  url:String = "http://localhost:8080/phpAngular/Gimnasio/Authorization/";

  Membresia = inject(ApiMembresia);
  Usuario = inject(ApiUsuario);
  Transaction = inject(ApiTransaction);
  Assistance = inject(ApiAssistance);
  RegisterPdf = inject(ApiRegisterPDF);

  authorization(admon: Admon){
    return this.httpClient.post(`${this.url}login.php`, JSON.stringify(admon));
  }

  singUp(admon: Admon): Observable<ResponsePhp>{
    return this.httpClient.post<ResponsePhp>(`${this.url}singUp.php`, JSON.stringify(admon));
  }



}
