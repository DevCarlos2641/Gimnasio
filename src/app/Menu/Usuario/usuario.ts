import { Component } from '@angular/core';
import { Usuario } from '../../Objects/Usuario';
import { Membresia } from 'src/app/Objects/Membresia';
import { Router } from '@angular/router';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { ServiceDataService } from 'src/app/Services/service-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogInformacion } from '../DialogInformacion';

@Component({
  selector: 'Usuario',
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: '#ffffff' },
  }],
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
export class UsuarioComponent{

  show = true;
  usuario:Usuario = new Usuario();
  membresia:Membresia = new Membresia();

  genero:string;
  cont:number;
  pathImg:String = "./assets/images/mujer.png";

  constructor(private router:Router, private ServiceDataMysql:ServicioDataMYSQLService,
    private Service:ServiceDataService, private dialog:MatDialog){}

  ngOnInit(){
    if(this.Service.getUsuarios() === null) this.cont = 0;
    else this.cont = this.Service.getUsuarios().length;
  }

  changeEstudiante(){
      this.membresia.estudiante = !this.membresia.estudiante;
      this.changeMonto();
  }

  changeMonto(){
      if(this.membresia.estudiante) this.membresia.monto = 150;
      else this.membresia.monto = 250;
  }

  getMonto():number{
      if(this.membresia.estudiante) return 150;
      return 250;
  }


  agregarUser(nombres:String, apellidos:String, telefono:String, edad:String, email:String, enfermedad:String, nip:String){
    if(nombres == "" || apellidos == "" || telefono == "" || edad == ""
        || email == "" || enfermedad == "" || nip == "")
        //alert("Favor De Llenar Correctamente Los campos");
        this.alertDialog("Favor de llenar correctamente los datos");
    else{
      if(this.genero === "hombre") this.usuario.sexo = "Hombre";
      else this.usuario.sexo = "Mujer";
      this.usuario.idUsuario = this.cont;
      this.usuario.nombres = nombres.trim();
      this.usuario.apellidos = apellidos.trim();
      this.usuario.telefono = parseInt(telefono.toString());
      this.usuario.email = email.trim();
      this.usuario.edad = parseInt(edad.toString());
      this.usuario.enfermedad = enfermedad.trim();
      this.usuario.nip = parseInt(nip.toString());

      this.membresia.idUsuario = this.cont;
      this.membresia.fechaPago = "";
      this.membresia.fechaExpiracion = "";

      this.ServiceDataMysql.Usuario.insert(this.usuario).subscribe(re=>{
        console.log(re);
        if(!(Object.values(re)[0] === "Alta Correcta")){
          alert("Algo Fallo, Intentelo Nuevamente"); return; }
      }).unsubscribe();
      this.ServiceDataMysql.Membresia.insert(this.membresia).subscribe(re=>{
        console.log(re);
        if(!(Object.values(re)[0] === "Alta Correcta")){
          alert("Algo Fallo, Intentelo Nuevamente"); return; }
      }).unsubscribe();

      this.alertDialog("El usuario "+this.usuario.nombres+" "+this.usuario.apellidos+
                        " fue agregado ¡ Correctamente !");

      this.router.navigate(['Main/Membresia',this.cont]);
    }
  }

  getFechaActual():String{
      let day = new Date().getDate();
      let mes = new Date().getMonth()+1;
      let anio = new Date().getFullYear();
      return mes+"/"+day+"/"+anio;
  }

  getFechaAMes():String{
      let day = new Date().getDate();
      let mes = new Date().getMonth()+1;
      let anio = new Date().getFullYear();
      if(mes === 12){
          mes = 1;
          anio++;
      } else mes++;
      return mes+"/"+day+"/"+anio;
  }

  sexo(sexo:String){
    if(sexo === "hombre") this.genero = "hombre";
    else this.genero = "mujer";
    this.pathImg = "./assets/images/"+this.genero+".png";
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion,{
      data:{message:msg},});
  }
}
