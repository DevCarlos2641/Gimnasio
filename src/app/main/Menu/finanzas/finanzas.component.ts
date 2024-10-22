import { Component, ViewChild } from '@angular/core';
import { animationComponent } from '../../../Animations/animation';
import { MatInputModule } from '@angular/material/input';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../Services/api.service';
import { DataService } from '../../../Services/data.service';
import jsPDF from 'jspdf';
import { Transaccion } from '../../../Objects/Transaccion';
import autoTable from 'jspdf-autotable'
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [MatInputModule, MatDatepickerModule, MatTableModule, MatButtonModule, FormsModule,
    ReactiveFormsModule, CurrencyPipe, MatButtonModule, MatPaginatorModule],
  animations: [animationComponent],
  templateUrl: './finanzas.component.html',
  styleUrl: './finanzas.component.css'
})
export class FinanzasComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedIndex:number = 0

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  columnas: string[] = ['usuario', 'fecha', 'monto', 'tipo'];
  dataSource:any;
  input:string = ""
  data:number = 0;

  constructor(private Api:ApiService, private Service:DataService){}

  ngOnInit(){
    this.range.value.start = new Date()
    this.range.value.end = new Date()
    this.range.valueChanges.subscribe(re=>{
      if (!re.start || !re.end) return;
      this.verificDate(re)
    });
  }

  verificDate(re:any){
    const start = re.start.getTime();
    const end = re.end.getTime()+86400000;
    const trans = this.Service.getTransacciones()
    .filter(value => {
      const fecha = new Date(value.fecha.toString()).getTime();
      return fecha >= start && fecha <= end;
    });
    this.data = trans.length;
    let t = new Transaccion();
    t.fecha = "-----";
    t.tipo = "Total";
    t.monto = trans.reduce((ac, v) => ac + Number(v.monto), 0)
    trans.push(t);
    this.dataSource = new MatTableDataSource(trans);
    this.dataSource.paginator = this.paginator;

  }

  descargarPDF(){
    if(this.data == 0) return;
    var doc = new jsPDF;
    var fechaConsulta = "";
    var fechaRegistro = "";
    const start = this.range.value.start!!
    const end = this.range.value.end!!

    var name = "Registros "+this.range.value.start?.getDate()+"/"+
      (start.getMonth()+1)+"/"+start.getFullYear();

    fechaConsulta = "Fecha de consulta:  " + new Date().toLocaleString();
    if(this.verificFecha())
      fechaRegistro =    "Fecha de registros: " + start.toLocaleString().split(',')[0]
    else fechaRegistro = "Fecha de registro:  " + start.toLocaleString().split(',')[0]
          + " ----- "+end.toLocaleString().split(',')[0];

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
  }

  verificFecha():boolean{
    return this.range.value.start!!.getTime() == this.range.value.end!!.getTime()
  }

  filtrar() {
    this.dataSource.filter = this.input.trim()
  }

}
