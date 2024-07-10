import { Component, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Transaccion } from 'src/app/Objects/Transaccion';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { animate, style, transition, trigger } from '@angular/animations';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { ServiceDataService } from 'src/app/Services/service-data.service';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.css'],
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
export class FinanzasComponent {
  show = true;
  columnas: string[] = ['usuario', 'fecha', 'monto', 'tipo'];
  total:number = 0;
  dataSource:any;
  fechaInicio:Date = new Date();
  fechaFin:Date = new Date();
  boton:HTMLInputElement;

  constructor(private ServiceDataMysql:ServicioDataMYSQLService, private Service:ServiceDataService){}

  ngOnInit(){
  }

  mostrar(){
    let transaccionesFecha:Transaccion [] = [];
    for(let trans of this.Service.getTransacciones()){
      let date = new Date(trans.fecha.toString());
      if(date.getFullYear() >= this.fechaInicio.getFullYear())
        if(date.getMonth()+1 > this.fechaInicio.getMonth()+1)
          transaccionesFecha.push(trans);
        else if(date.getMonth()+1 === this.fechaInicio.getMonth()+1)
          if(date.getDate() >= this.fechaInicio.getDate())
            transaccionesFecha.push(trans);
    }
    let transaccionesFechaChida:Transaccion [] = [];
    for(let trans of transaccionesFecha){
      let date = new Date(trans.fecha.toString());4
      if(date.getFullYear() <= this.fechaFin.getFullYear())
        if(date.getMonth()+1 < this.fechaFin.getMonth()+1)
        transaccionesFechaChida.push(trans);
        else if(date.getMonth()+1 === this.fechaFin.getMonth()+1)
          if(date.getDate() <= this.fechaFin.getDate())
            transaccionesFechaChida.push(trans);
    }
    this.total = 0;
    for(let trans of transaccionesFechaChida){
      this.total+=parseInt(trans.monto.toString());
    }

    let t = new Transaccion();
    t.fecha = "-----";
    t.tipo = "Total";
    t.monto = this.total;
    transaccionesFechaChida.push(t);
    this.dataSource = new MatTableDataSource(transaccionesFechaChida);
  }

  setFechaInicio(event:MatDatepickerInputEvent<Date>){
    let x:any = event.value?.getMonth();
    let fecha = new Date(x+1+"/"+event.value?.getDate()+"/"+event.value?.getFullYear());
    this.fechaInicio = fecha;
    if(!(this.fechaInicio.toString() === "Invalid Date"))
      this.mostrar();
    if(this.boton !== undefined)
      this.boton.disabled = false;
  }

  setFechaFin(event:MatDatepickerInputEvent<Date>){
    let x:any = event.value?.getMonth();
    let fecha = new Date(x+1+"/"+event.value?.getDate()+"/"+event.value?.getFullYear());
    this.fechaFin = fecha;
    if(!(this.fechaFin.toString() === "Invalid Date"))
      this.mostrar();
    if(this.boton !== undefined)
      this.boton.disabled = false;
  }

  descargarPDF(event:Event){
    var doc = new jsPDF;
    var fechaConsulta = "";
    var fechaRegistro = "";

    var name = "Registros "+this.fechaInicio.getDate()+"/"+
      (this.fechaInicio.getMonth()+1)+"/"+this.fechaInicio.getFullYear();

    fechaConsulta = "Fecha de consulta:  "+this.formatoFecha(new Date(), true);
    if(this.verificFecha())
      fechaRegistro =    "Fecha de registros: "+this.formatoFecha(this.fechaInicio, false);
    else fechaRegistro = "Fecha de registro:  "+this.formatoFecha(this.fechaInicio, false)+" ----- "+this.formatoFecha(this.fechaFin, false);

    //  Formato PDF
    doc.setFontSize(20);
    doc.setFont("times");
    doc.text("Gimnasio De Amacueca", 75, 10);
    doc.setFontSize(10);
    doc.text(fechaConsulta, 10, 20);
    doc.text(fechaRegistro, 10, 25);
    autoTable(doc, {html: '#tablaID', margin:{top:35}});
    //doc.save(name+'.pdf');
    doc.output('dataurlnewwindow',{filename: name+".pdf"});

    (event.target as HTMLInputElement).disabled = true;
    this.boton = event.target as HTMLInputElement;
  }

  verificFecha():boolean{
      return (this.fechaInicio.getDate() === this.fechaFin.getDate() &&
      this.fechaInicio.getMonth()+1 === this.fechaFin.getMonth()+1 &&
      this.fechaInicio.getFullYear() == this.fechaFin.getFullYear())
  }

  formatoFecha(date:Date, horas:boolean):String{
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
                  "Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"];
    let x = date.getMonth();
    let consulta = date.getDate()+"/"+meses[date.getMonth()]+"/"+date.getFullYear();
    if(horas) consulta += " - "+date.getHours()+":"+date.getMinutes()+" Hrs";
    return consulta;
  }

  filtrar(event: Event) {
    try{
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filtro.trim().toLowerCase();
      if(this.boton !== undefined)
        this.boton.disabled = false;
    } catch (e:any) {
      console.log((e as Error).message);
    }
  }
}
