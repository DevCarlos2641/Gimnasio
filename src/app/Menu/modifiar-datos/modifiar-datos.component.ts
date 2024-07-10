import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Usuario } from 'src/app/Objects/Usuario';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ServiceDataService } from 'src/app/Services/service-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogInformacion } from '../DialogInformacion';

@Component({
  selector: 'app-modifiar-datos',
  templateUrl: './modifiar-datos.component.html',
  styleUrls: ['./modifiar-datos.component.css'],
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
export class ModifiarDatosComponent {

  show = true;
  nombresUs:String[] = [];
  input:String = "";
  inputN:number;
  usuarioToModific:Usuario = new Usuario();
  usuarioSelect:String = "";
  buscar:Object;
  buscarN:Object;
  num:number = 10;
  bandera:boolean;

  constructor(private ServiceDataMysql:ServicioDataMYSQLService, private Service:ServiceDataService,
              private router:Router, private dialog:MatDialog){}

  ngOnInit(){
    for(let c in this.Service.getUsuarios()){
      this.nombresUs.push(this.Service.getUsuarios()[c].nombres);
    }
  }

  buscarNombre(event:Event){
    this.input = (event.target as HTMLInputElement).value;
    this.usuarioSelect = "";
    for(let i = 0; i < this.nombresUs.length; i++){
      if(this.input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
      this.nombresUs[i].toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")){
        this.usuarioToModific = this.Service.getUsuarios()[i];
        break;
      } else{ this.usuarioToModific = new Usuario(); }
    }
  }

  buscarId(event:Event){
    this.inputN = parseInt((event.target as HTMLInputElement).value);
    this.usuarioSelect = "";
    this.bandera = false;
    for(let i = 0; i < this.nombresUs.length; i++){
      if(!(this.nombresUs[this.inputN] === undefined)) this.bandera = true;
      else this.bandera = false;
    }
    if(this.bandera){
      this.usuarioToModific = this.Service.getUsuarios()[this.inputN];
    }
    else this.usuarioToModific = new Usuario();
  }

  rellenar(){
    for(let i = 0; i < this.nombresUs.length; i++){
        if(this.usuarioSelect === this.nombresUs[i]){
          this.usuarioToModific = this.Service.getUsuarios()[i];
          this.buscar = "";
          break;
        } else { this.usuarioToModific = new Usuario(); }
    }
  }

  modificarUsuario(nombres:String, apellidos:String, telefono:String, email:String, enfermedad:String){
    if(nombres == "" || apellidos == "" || telefono == "" || email == "" || enfermedad == ""){
        this.alertDialog("Favor De No Dejar Ningun Espacio En Blanco");
      } else {
        this.usuarioToModific.nombres = nombres.trim();
        this.usuarioToModific.apellidos = apellidos.trim();
        this.usuarioToModific.telefono = parseInt(telefono.toString());
        this.usuarioToModific.email = email.trim();
        this.usuarioToModific.enfermedad = enfermedad.trim();

        this.ServiceDataMysql.Usuario.update(this.usuarioToModific).subscribe(re=>{
          if(!(Object.values(re)[0] === "Alta Correcta")){
            alert("Algo Salio Mal, Porfavor Intente De Nuevo!"); return; }
          this.Service.findUsuarios();
        });
        this.alertDialog("Se Modifico Correctamente El Usuario");
        this.router.navigate(['/Main/Registros']);
      }
  }

  changeM(event:Event){
    (event.target as HTMLInputElement).style.color = "#E83845";
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion,{
      data:{message:msg}});
  }
}
