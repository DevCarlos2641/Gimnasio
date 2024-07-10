import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceDataService } from '../Services/service-data.service';
import { Router } from '@angular/router';
import { ServicioDataMYSQLService } from '../Services/servicio-data-mysql.service';
import { Asistencia } from '../Objects/Asistencia';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent {

  findText:boolean = false;
  columnas: string[] = ['fecha', 'hora', 'nombre', 'servicio'];
  dataSource:any;
  table:Table [] = [];
  cliente:boolean = true;

  constructor(private service:ServiceDataService, private router:Router,
    private serviceData:ServicioDataMYSQLService){}

  ngOnInit(){
    if(this.router.url.toString().split("/")[1] === "Cliente")
      this.cliente = false;
    else
      this.cliente = true;
    for(let value in this.service.getAsistencias()){
      let t = new Table();
      t.fecha = this.service.getAsistencias()[value].fecha;
      t.hora = this.service.getAsistencias()[value].hora;
      t.servicio = this.service.getAsistencias()[value].servicio;
      t.nombre = this.service.getUsuarios()
                [(this.service.getAsistencias()[value].idUsuario)].nombres;
      this.table.push(t);
    }
    this.dataSource = new MatTableDataSource(this.table);
  }

  registrar(form:NgForm){

    const id = form.value.id;
    const nip = form.value.nip;

    let usuarios = this.service.getUsuarios();
    if(usuarios[id].nip == nip){
      let as = new Asistencia();
      as.fecha = this.getFechaActual();
      as.hora = this.getHoraActual();
      as.idUsuario = id;
      as.servicio = "Membresia";

      this.serviceData.Assistance.asistencia(as).subscribe(re=>{
        console.log(re);
        this.service.findAsistencias();
      })
      this.findText = true;
    }
  }

  getFechaActual(): String {
    let day = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let anio = new Date().getFullYear();
    return mes + "/" + day + "/" + anio;
  }

  getHoraActual(): String{
    let hora = new Date().getHours();
    let minute = new Date().getMinutes();
    return hora + ":" + minute;
  }

}

export class Table{
  constructor(){}
  fecha:String;
  hora:String;
  idUsuario:number;
  servicio:String;
  nombre:String;
}
