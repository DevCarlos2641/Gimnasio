import { Injectable } from '@angular/core';
import { Usuario } from '../Objects/Usuario';
import { ServicioDataMYSQLService } from './servicio-data-mysql.service';
import { Asistencia } from '../Objects/Asistencia';
import { Membresia } from '../Objects/Membresia';
import { Observable, Subscription } from 'rxjs';
import { RegistroPdf } from '../Objects/RegistroPdf';
import { Transaccion } from '../Objects/Transaccion';

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {

  private usuarios: Usuario[] = [];
  private asistencias: Asistencia[] = [];
  private membresias: Membresia[] = [];
  private registrosPDf: RegistroPdf[] = [];
  private transacciones: Transaccion[] = [];

  constructor(private service:ServicioDataMYSQLService) { }

  findUsuarios(){
    this.service.Usuario.get().subscribe(re=>{
      if(re != null)
        this.usuarios = re;
    });
  }
  getUsuarios(){ return this.usuarios; }

  findAsistencias(){
    this.service.Assistance.get().subscribe(re=>{
      if(re != null)
        this.asistencias = Object.values(re);
    });
  }
  getAsistencias(){ return this.asistencias; }

  findMembresias(){
    this.service.Membresia.get().subscribe(re=>{
      this.membresias = Object.values(re);
    })
  }
  getMembresias(){ return this.membresias; }

  findRegistrosPdf(){
    this.service.RegisterPdf.get().subscribe(re=>{
      this.registrosPDf = Object.values(re);
    })
  }
  getRegistrosPdf(){ return this.registrosPDf; }

  findTransacciones(){
    this.service.Transaction.get().subscribe(re=>{
      this.transacciones = Object.values(re);
    })
  }
  getTransacciones(){ return this.transacciones }

}
