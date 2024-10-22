import { Injectable } from '@angular/core';
import { NameComplet } from '../Objects/Interfacez';
import { Membresia } from '../Objects/Membresia';
import { RegistroPdf } from '../Objects/RegistroPdf';
import { Transaccion } from '../Objects/Transaccion';
import { Usuario } from '../Objects/Usuario';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private usuarios: Usuario[] = [];
  private membresias: Membresia[] = [];
  private registrosPDf: RegistroPdf[] = [];
  private transacciones: Transaccion[] = [];

  constructor(private Api:ApiService) { }

  findUsuarios(){
    this.Api.Usuario.get().subscribe(re=>{
      this.usuarios = re;
    });
  }
  updateUsuario(usuario: Usuario){
    this.usuarios = this.usuarios.filter(v=>v.idUsuario != usuario.idUsuario);
    this.usuarios.push(usuario);
  }
  getUsuarios(){ return this.usuarios; }
  getUsuarioById(idUsuario: number): Usuario{
    const value = this.usuarios.filter(val => val.idUsuario == idUsuario)[0];
    if(value == undefined) return new Usuario();
    const user = new Usuario();
    user.idUsuario = Number(value.idUsuario);
    user.nombres = value.nombres;
    user.apellidos = value.apellidos;
    user.telefono = Number(value.telefono);
    user.sexo = value.sexo;
    user.edad = Number(value.edad);
    user.email = value.email;
    user.enfermedad = value.enfermedad;
    user.nip = Number(value.nip);
    return user;
  }
  getNamesComplets(): NameComplet[]{
    return this.usuarios.map(v => {
      let name:NameComplet = {
        idUsuario: v.idUsuario,
        name: v.nombres+" "+v.apellidos
      }
      return name;
    });
  }

  pushUsuario(usuario:Usuario){
    this.usuarios.push(usuario);
  }

  findMembresias(){
    this.Api.Membresia.get().subscribe(re=>{
      this.membresias = re
    })
  }
  getMembresias(){ return this.membresias; }
  getMembresiaById(idUsuario:number){
    console.log(this.membresias);
    return this.membresias.filter(val => val.idUsuario == idUsuario)[0];
  }
  pushMembresia(membresia: Membresia){
    this.membresias.push(membresia);
  }
  updateMembresia(membresia: Membresia){
    this.membresias = this.membresias.filter(v=>v.idUsuario != membresia.idUsuario);
    this.membresias.push(membresia);
  }

  findRegistrosPdf(){
    this.Api.RegisterPdf.get().subscribe(re=>{
      this.registrosPDf = Object.values(re);
    })
  }
  getRegistrosPdf(){ return this.registrosPDf; }
  pushRegistroPdf(reg: RegistroPdf){
    this.registrosPDf.push(reg);
  }
  getRegistroPdfByIdAndDate(idUsuario:number, fecha:string){
    return this.registrosPDf.filter( value => value.idUsuario == idUsuario && value.fechaPago == fecha)[0]
  }

  findTransacciones(){
    this.Api.Transaction.get().subscribe(re=>{
      this.transacciones = Object.values(re);
    })
  }
  getTransacciones(){ return this.transacciones }
  pushTransaccion(trans: Transaccion){
    this.transacciones.push(trans);
  }

  cleanData(){
    this.usuarios = [];
    this.membresias = [];
    this.registrosPDf = [];
    this.transacciones = [];
  }
}
