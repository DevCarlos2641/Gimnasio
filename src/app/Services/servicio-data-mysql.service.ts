import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Membresia } from '../Objects/Membresia';
import { Usuario } from '../Objects/Usuario';
import { Transaccion } from '../Objects/Transaccion';
import { Admon } from '../Objects/Admon';
import { RegistroPdf } from '../Objects/RegistroPdf';
import { Asistencia } from '../Objects/Asistencia';
import { Observable } from 'rxjs';
import { ResponsePhp } from '../Objects/Interfacez';
import { ApiMembresia } from './Router/ApiMembresia';
import { ApiUsuario } from './Router/ApiUsuario';
import { ApiTransaction } from './Router/ApiTransaction';
import { ApiAssistance } from './Router/ApiAssistance';
import { ApiRegisterPDF } from './Router/ApiRegisterPDF';

@Injectable({
  providedIn:'root'
})
export class ServicioDataMYSQLService {

  constructor(private httpClient:HttpClient) { }

  url:String = "http://localhost:8080/phpAngular/Gimnasio/";

  Membresia = inject(ApiMembresia);
  Usuario = inject(ApiUsuario);
  Transaction = inject(ApiTransaction);
  Assistance = inject(ApiAssistance);
  RegisterPdf = inject(ApiRegisterPDF);

  authorization(admon: Admon){
    return this.httpClient.post(`${this.url}Authorization/login.php`, JSON.stringify(admon));
  }

  singUp(admon: Admon): Observable<ResponsePhp>{
    return this.httpClient.post<ResponsePhp>(`${this.url}Authorization/singUp.php`, JSON.stringify(admon));
  }

}
