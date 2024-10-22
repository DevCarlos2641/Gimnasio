import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { animationComponent } from '../../../Animations/animation';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ApiService } from '../../../Services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogInformacion } from '../../../Dialogs/information.dialog';
import { GenerarPdf } from '../../../Objects/GenerarPdf';
import { Membresia } from '../../../Objects/Membresia';
import { RegistroPdf } from '../../../Objects/RegistroPdf';
import { Transaccion } from '../../../Objects/Transaccion';
import { Usuario } from '../../../Objects/Usuario';
import { DataService } from '../../../Services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { Registros } from '../../../Objects/Interfacez';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-membresia',
  standalone: true,
  animations: [animationComponent],
  imports: [MatInputModule, FormsModule, MatCheckbox, MatButtonModule, MatTabsModule,
    MatDatepickerModule, MatTableModule, MatIconModule, MatPaginator, MatPaginatorModule
  ],
  templateUrl: './membresia.component.html',
  styleUrl: './membresia.component.css'
})
export class MembresiaComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedIndex:number = 0

  //  var for update membership
  usuario: Usuario = new Usuario();
  membresia: Membresia = new Membresia();
  cambio: number = 0;
  message: String = "";
  showPago:boolean = false;
  pago: number = 0;
  input:string;
  inputId:number;
  countRegistros:number;
  pathImg:String = "./assets/images/Hombre.png";

  //  var for membership
  show = true;
  dataSource:any;
  columnas: string[] = ['idUsuario', 'nombre', 'fechaPago', 'monto', 'pago', 'cambio', 'pdf'];
  fecha:Date = new Date();
  registros:Registros[] = [];
  allFechas:boolean = false;

  constructor(private router: ActivatedRoute, private Api:ApiService,
    private Service:DataService, private cookies:CookieService, private dialog:MatDialog) { }

  ngOnInit() {
    this.inputId = this.router.snapshot.params['id'];
    this.Service.getRegistrosPdf().length;
    this.buscarId();
    this.Api.RegisterPdf.getWhitName().subscribe(re=>{
      this.registros = re;
      this.refresh();
    })
  }

  buscarNombre(){
    this.inputId = Number("");
    const value = this.Service.getUsuarios().filter(v => {
      if(this.input.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
          v.nombres.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")+" "+
          v.apellidos.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        return v
      else return "";
    });
    if(value.length > 0) {
      this.usuario = value[0];
      this.membresia = this.Service.getMembresiaById(this.usuario.idUsuario);
      this.inputId = this.usuario.idUsuario;
      this.showData()
    }
    else {
      this.usuario = new Usuario();
      this.message = "";
      this.showPago = true;
    }
  }

  buscarId() {
    this.input = "";
    const user = this.Service.getUsuarioById(this.inputId);
    if(user.idUsuario != -1) {
      this.usuario = user;
      this.membresia = this.Service.getMembresiaById(this.inputId);
      this.input = this.usuario.nombres+" "+this.usuario.apellidos;
      this.showData();
    }
    else {
      this.membresia = new Membresia();
      this.usuario = new Usuario();
      this.message = "";
      this.showPago = true;
    }
  }

  showData(){
    this.pathImg = `./assets/images/${this.usuario.sexo}.png`;
    if(Number(this.membresia.estudiante) == 1) this.membresia.estudiante = true;
    else this.membresia.estudiante = false;

    if (this.membresia.monto > 0) {
      this.message = "Membresia Caducada, Favor De Pagar Su Membresia";
      this.showPago = false;
      if(this.membresia.estudiante) this.membresia.monto = 150;
      else this.membresia.monto = 250;
    }
    else {
      this.message = "Membresia Acualizada";
      this.showPago = true;
    }
  }

  changeEstudiante() {
    this.membresia.estudiante = !this.membresia.estudiante;
    if (this.membresia.estudiante) this.membresia.monto = 150;
    else this.membresia.monto = 250;
    this.pago = 0;
    this.cambio = 0;
  }

  darCambio() {
    if (Number.isNaN(this.pago)) return;
    if (this.pago >= this.membresia.monto) {
      this.cambio = this.pago - this.membresia.monto;
    } else {
      this.cambio = 0;
    }
  }

  renovar() {
    if(this.showPago && this.inputId > 0)
      return this.alertDialog("La Membresia De "+this.usuario.nombres+" "+
                            this.usuario.apellidos+" Esta Actualizada")

    this.membresia.monto -= this.pago;
    if (this.membresia.monto > 0)
      return this.alertDialog("Favor De Pagar El Monto De Membresia");

    this.membresia.monto = 0;
    this.membresia.fechaPago = new Date().toLocaleString();
    this.membresia.fechaExpiracion = this.getFechaAMes();

    const transaccion = new Transaccion();
    transaccion.idUsuario = this.membresia.idUsuario;
    transaccion.fecha = new Date().toString();
    transaccion.monto = this.getMonto();
    transaccion.tipo = "Renovación Membresia";

    this.Api.Membresia.update(this.membresia).subscribe(re=>{
      if(re.message != "OK") return alert("Algo Salio Mal, Porfavor Intente De Nuevo!")
      this.Service.updateMembresia(this.membresia);
      this.Api.Transaction.insert(transaccion).subscribe(re=>{
        if(re.message != "OK") return alert("Algo Salio Mal, Porfavor Intente De Nuevo!")
        this.Service.pushTransaccion(transaccion);
        console.log(this.Service.getTransacciones());
        this.downloadPDF();
      });
    });

    const msg = "La Membresia De: "+this.usuario.nombres+" "+this.usuario.apellidos
                  +" Fue Actualizada Correctamente!!!";
    const dialog = this.dialog.open(DialogInformacion, {data:{message:msg}});
    dialog.afterClosed().subscribe(re=>{
      // this.routerr.navigate(['/Main/ListaMembresias'])
      this.reset();
    });
  }

  reset(){
    this.usuario = new Usuario();
    this.membresia = new Membresia();
    this.cambio = 0;
    this.message = "";
    this.showPago = true;
    this.pago = 0;
    this.input = "";
    this.inputId = 0
    this.countRegistros++;
    this.pathImg = "./assets/images/Hombre.png";
  }

  downloadPDF() {
    var date = new Date();
    var registroPdf:RegistroPdf = new RegistroPdf();
    registroPdf.idUsuario = this.usuario.idUsuario;
    registroPdf.fechaPago = date.toString();
    registroPdf.monto = this.getMonto();
    registroPdf.pago = this.pago;
    registroPdf.cambio = this.pago - this.getMonto()
    registroPdf.folio = (this.countRegistros+""+this.usuario.idUsuario+date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear()).toString();
    let nombreC = this.usuario.nombres+" "+this.usuario.apellidos;
    var doc = new GenerarPdf().generar(registroPdf, nombreC);

    doc.output('dataurlnewwindow', { filename: "reporte.pdf" });
    this.Api.RegisterPdf.insert(registroPdf).subscribe(re=>{
      const reg:Registros = {
        idUsuario: this.usuario.idUsuario,
        nombres: this.usuario.nombres,
        fechaPago: registroPdf.fechaPago,
        monto: this.getMonto(),
        pago: this.pago,
        cambio: this.cambio,
        pdf: ""
      }
      this.registros.push(reg);
      this.Service.pushRegistroPdf(registroPdf);
      this.refresh();
      this.selectedIndex = 1;
    });
  }

  getMonto(): number {
    if (this.membresia.estudiante) return 150;
    return 250;
  }

  getFechaAMes(): String {
    let day = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let anio = new Date().getFullYear();
    if (mes === 12) {
      mes = 1;
      anio++;
    } else mes++;
    return new Date(mes+"/"+day+"/"+anio).toLocaleString();
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion, {data:{message:msg}});
  }

  //            MemberShip Register

  refresh(){
    let registroTemp:Registros[] = [];
    if(!this.allFechas){
      for(let i in this.registros){
        if(this.verificDate(this.registros[i]))
          registroTemp.push(this.registros[i]);
      }
    } else registroTemp = this.registros;
    this.dataSource = new MatTableDataSource(registroTemp);
    this.dataSource.paginator = this.paginator;
  }

  verificDate(register: Registros): boolean{
    const min = new Date(this.fecha.toDateString()).getTime();
    const max = min+86400000;
    const value = new Date(register.fechaPago.toString()).getTime();
    return value >= min && value < max;
  }

  setFecha(event:MatDatepickerInputEvent<Date>){
    let x:any = event.value?.getMonth();
    let fecha = new Date(x+1+"/"+event.value?.getDate()+"/"+event.value?.getFullYear());
    this.fecha = fecha;
    if(!(this.fecha.toString() === "Invalid Date"))
      this.refresh();
  }

  changeFecha(){
    let d = document.getElementById("body");
    this.allFechas = !this.allFechas;
    this.refresh();
  }

  downloadPdf(idUsuario:number, fecha:string){
    let nombreC = this.Service.getUsuarioById(idUsuario).nombres+" "
                  +this.Service.getUsuarioById(idUsuario).apellidos;

    const registro = this.Service.getRegistroPdfByIdAndDate(idUsuario, fecha)
    const doc = new GenerarPdf().generar(registro, nombreC);
    doc.output('dataurlnewwindow', { filename: "Registro.pdf" });
  }

}
