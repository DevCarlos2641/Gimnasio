import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { RegistroPdf } from 'src/app/Objects/RegistroPdf';
import { Usuario } from 'src/app/Objects/Usuario';
import { MatTableDataSource } from '@angular/material/table';
import { GenerarPdf } from 'src/app/Objects/GenerarPdf';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ServiceDataService } from 'src/app/Services/service-data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-lista-membresias',
  templateUrl: './lista-membresias.component.html',
  styleUrls: ['./lista-membresias.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(15px)' })),
      ]),
    ])
  ]
})
export class ListaMembresiasComponent {

  show = true;
  dataSource:any;
  columnas: string[] = ['idUsuario', 'nombre', 'fechaPago', 'monto', 'pago', 'cambio', 'pdf'];
  fecha:Date = new Date();
  registros:Registros[] = [];
  allFechas:boolean = false;

  constructor(private ServiceDataMysql:ServicioDataMYSQLService, private Service:ServiceDataService,
              private cookies:CookieService){}

  ngOnInit(){
    this.ServiceDataMysql.RegisterPdf.get().subscribe(re=>{
      if(!(re === null)){
        let registrosPdf = Object.values(re);
        for(let value in registrosPdf){
          let reg = new Registros();
          reg.idUsuario = registrosPdf[value].idUsuario;
          reg.nombre = "";
          reg.fechaPago = registrosPdf[value].fechaPago;
          reg.monto = registrosPdf[value].monto;
          reg.pago = registrosPdf[value].pago;
          reg.cambio = registrosPdf[value].cambio;
          reg.pdf = "Download";
          this.registros.push(reg);
        }
      }
    });
    this.ServiceDataMysql.Usuario.get().subscribe(re=>{
      if(!(re === null)){
        let usuarios:Usuario[] = Object.values(re);
        for(let value in this.registros){
          if(this.registros[value].nombre === "")
          this.registros[value].nombre = usuarios[this.registros[value].idUsuario].nombres+" "+usuarios[this.registros[value].idUsuario].apellidos;
        }
        this.refresh();
      }
    });
  }

  refresh(){
    let registroTemp:Registros[] = [];
    if(!this.allFechas){
      for(let i in this.registros){
        if(this.fecha.toDateString()===this.registros[i].fechaPago)
          registroTemp.push(this.registros[i]);
      }
    } else registroTemp = this.registros;
    this.dataSource = new MatTableDataSource(registroTemp);
  }

  setFecha(event:MatDatepickerInputEvent<Date>){
    let x:any = event.value?.getMonth();
    let fecha = new Date(x+1+"/"+event.value?.getDate()+"/"+event.value?.getFullYear());
    this.fecha = fecha;
    if(!(this.fecha.toString() === "Invalid Date"))
      this.refresh();
  }

  changeFecha(){
    this.allFechas = !this.allFechas;
    this.refresh();
  }

  downloadPdf(idUsuario:number){
    let nombreC = this.Service.getUsuarios()[idUsuario].nombres+" "
                  +this.Service.getUsuarios()[idUsuario].apellidos;

    for(let i in this.Service.getRegistrosPdf()){
      if(this.Service.getRegistrosPdf()[i].idUsuario === idUsuario){
        let doc = new GenerarPdf().generar(this.Service.getRegistrosPdf()[i], nombreC);
        doc.output('dataurlnewwindow', { filename: "prueba.pdf" });
        return;
      }
    }
  }
}

export class Registros{
  constructor(){}
  idUsuario:number;
  nombre:String;
  fechaPago:String;
  monto:number;
  pago:number;
  cambio:number;
  pdf:String;
}
