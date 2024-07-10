import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Transaccion } from 'src/app/Objects/Transaccion';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { ServiceDataService } from 'src/app/Services/service-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogInformacion } from '../DialogInformacion';

@Component({
  selector: 'app-visita',
  templateUrl: './visita.component.html',
  styleUrls: ['./visita.component.css'],
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
export class VisitaComponent {

  show = true;
  estudiante:boolean = false;
  monto:number = 25;
  pago:number = 0;
  vuelto:number = 0;
  transaccion:Transaccion = new Transaccion();


  constructor(private ServiceDataMysql:ServicioDataMYSQLService, private Service:ServiceDataService,
              private router:Router, private dialog:MatDialog){}

  ngOnInit(){

  }

  changeEstudiante(){
    this.estudiante = !this.estudiante;
    this.changeMonto();
    this.vuelto = 0;
    this.pago = 0;
  }
  changeMonto(){
    if(this.estudiante) this.monto = 15;
    else this.monto = 25;
  }
  getMonto():number{
    if(this.estudiante) return 15;
    else return 25;
  }

  darCambio(event:Event){
    this.pago = parseInt((event.target as HTMLInputElement).value);
    if(this.pago > this.monto){
      this.changeMonto();
      this.vuelto = this.pago-this.monto;
      this.monto = 0;
    } else {
      this.vuelto = 0;
      this.changeMonto();
    }
  }

  entrar(){
    if(this.monto === 0){

      this.transaccion.fecha = new Date().toDateString();
      this.transaccion.monto = this.getMonto();
      this.transaccion.tipo = "Visita Del Dia";

      this.ServiceDataMysql.Transaction.insert(this.transaccion).subscribe(re=>{
        if(!(Object.values(re)[0] === "Alta Correcta")){
          alert("Algo Salio Mal, Porfavor Intente De Nuevo!"); return; }
        this.Service.findTransacciones()
      });

      this.alertDialog("Bienvenido Al gym");
      this.router.navigate(["/Main/Finanzas"])
    } else this.alertDialog("Favor De Pagar El Monto...");
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion,{data:{message:msg}});
  }
}
