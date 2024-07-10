import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { delay } from 'rxjs';
import { GenerarPdf } from 'src/app/Objects/GenerarPdf';
import { Membresia } from 'src/app/Objects/Membresia';
import { RegistroPdf } from 'src/app/Objects/RegistroPdf';
import { Transaccion } from 'src/app/Objects/Transaccion';
import { Usuario } from 'src/app/Objects/Usuario';
import { ServiceDataService } from 'src/app/Services/service-data.service';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { DialogInformacion } from '../DialogInformacion';

@Component({
  selector: 'app-membresia',
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.css'],
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

export class MembresiaComponent {

  show = true;

  usuarioMembresia: Usuario = new Usuario();
  membresia: Membresia = new Membresia();

  cambio: number = 0;
  message: String = "";
  pago: boolean = true;
  pagoB: number = 0;
  inputId:number;
  countRegistros:number;
  pathImg:String = "./assets/images/hombre.png";

  constructor(private router: ActivatedRoute, private ServiceDataMysql:ServicioDataMYSQLService, private routerr:Router,
    private Service:ServiceDataService, private cookies:CookieService, private dialog:MatDialog) { }

  async ngOnInit() {
    this.inputId = this.router.snapshot.params['id'];
    if(this.inputId >= 0){
      this.Service.findUsuarios();
      this.Service.findMembresias();
    }

    if(this.Service.getRegistrosPdf() == null) this.countRegistros = 0;
    else this.countRegistros = this.Service.getRegistrosPdf().length;
    await new Promise(f => setTimeout(f, 1000));
    this.buscarId();
  }

  buscarId() {

    if (!(this.Service.getUsuarios()[this.inputId] === undefined)) {
      this.usuarioMembresia = this.Service.getUsuarios()[this.inputId];
      this.membresia = this.Service.getMembresias()[this.inputId];

      if(this.usuarioMembresia.sexo === "Hombre") this.pathImg = "./assets/images/hombre.png";
      else this.pathImg = "./assets/images/mujer.png"

      if (this.membresia.monto > 0) {
        this.message = "Membresia Caducada, Favor De Pagar Su Membresia";
        this.pago = false;
      }
      else {
        this.message = "Membresia Acualizada";
        this.pago = true;
      }
    }
    else {
      this.membresia = new Membresia();
      this.usuarioMembresia = new Usuario();
      this.message = "";
      this.pago = true;
    }
  }

  changeEstudiante() {
    this.membresia.estudiante = !this.membresia.estudiante;
    this.changeMonto();
  }

  changeMonto() {
    if (this.membresia.estudiante) this.membresia.monto = 150;
    else this.membresia.monto = 250;
    this.pagoB = 0;
    this.cambio = 0;
  }

  darCambio(event: Event) {
    this.pagoB = parseInt((event.target as HTMLInputElement).value);
    if (Number.isNaN(this.pagoB)) this.pagoB = 0;
    let membresia: number = parseInt(this.membresia.monto.toString())
    if (this.pagoB >= membresia) {
      this.cambio = this.pagoB - membresia;
    } else {
      this.cambio = 0;
    }
  }

  renovar() {
    if(!this.pago){
      this.membresia.monto -= this.pagoB;
      if (this.membresia.monto < 0) this.membresia.monto = 0;
      if (this.membresia.monto > 0) {
        this.alertDialog("Favor De Pagar El Monto De Membresia");
        this.changeMonto();
      } else {
        this.membresia.fechaPago = this.getFechaActual();
        this.membresia.fechaExpiracion = this.getFechaAMes();
        let transaccion = new Transaccion();
        transaccion.idUsuario = this.membresia.idUsuario;
        transaccion.fecha = new Date().toDateString();
        transaccion.monto = this.getMonto();
        transaccion.tipo = "Renovacion Membresia";

        this.ServiceDataMysql.Membresia.update(this.membresia).subscribe(re=>{
          if(!(Object.values(re)[0] === "Alta Correcta")){
            alert("Algo Salio Mal, Porfavor Intente De Nuevo!"); return; }
            this.Service.findMembresias();
        });

        this.ServiceDataMysql.Transaction.insert(transaccion).subscribe(re=>{
          if(!(Object.values(re)[0] === "Alta Correcta")){
            alert("Algo Salio Mal, Porfavor Intente De Nuevo!"); return; }
            this.Service.findTransacciones();
        });

        this.alertDialog("La Membresia De: "+this.usuarioMembresia.nombres+" "+this.usuarioMembresia.apellidos
                      +" Fue Actualizada Correctamente!!!");
        this.downloadPDF();
        this.routerr.navigate(['/Main/ListaMembresias']);
      }
    } else if(this.inputId > 0)
      this.alertDialog("La Membresia De "+this.usuarioMembresia.nombres+" "+
                            this.usuarioMembresia.apellidos+" Esta Actualizada");
  }

  downloadPDF() {
    var date = new Date();
    var registroPdf:RegistroPdf = new RegistroPdf();
    registroPdf.idUsuario = this.usuarioMembresia.idUsuario;
    registroPdf.fechaPago = date.toDateString();
    registroPdf.monto = this.getMonto();
    registroPdf.pago = this.pagoB;
    registroPdf.cambio = this.getCambio();
    registroPdf.folio = (this.countRegistros+""+this.usuarioMembresia.idUsuario+date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear()).toString();
    let nombreC = this.usuarioMembresia.nombres+" "+this.usuarioMembresia.apellidos;
    var doc = new GenerarPdf().generar(registroPdf, nombreC);

    doc.output('dataurlnewwindow', { filename: "prueba.pdf" });
    this.ServiceDataMysql.RegisterPdf.insert(registroPdf).subscribe(re=>{
      this.Service.findRegistrosPdf();
    });
    this.cookies.set("actualizar", "true");
  }

  getMonto(): number {
    if (this.membresia.estudiante) return 150;
    return 250;
  }

  getCambio(): number {
    return this.pagoB - this.getMonto();
  }

  getFechaActual(): String {
    let day = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let anio = new Date().getFullYear();
    return mes + "/" + day + "/" + anio;
  }
  getFechaAMes(): String {
    let day = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let anio = new Date().getFullYear();
    if (mes === 12) {
      mes = 1;
      anio++;
    } else mes++;
    return mes + "/" + day + "/" + anio;
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion, {data:{message:msg}});
  }
}
