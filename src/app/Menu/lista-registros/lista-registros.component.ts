import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServicioDataMYSQLService } from 'src/app/Services/servicio-data-mysql.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ServiceDataService } from 'src/app/Services/service-data.service';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Usuario } from 'src/app/Objects/Usuario';


@Component({
  selector: 'app-lista-registros',
  templateUrl: './lista-registros.component.html',
  styleUrls: ['./lista-registros.component.css'],
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
export class ListaRegistrosComponent {

  show = true;
  dataSource:any;
  registros:Registro[] = [];
  columnas: string[] = ['id', 'nombres', 'apellidos', 'membresia', 'expira'];

  constructor(private Service:ServiceDataService, private dialog:MatDialog){}

  ngOnInit(){
    if(!(this.Service.getUsuarios() === null)){{
      for(let i = 0; i < this.Service.getUsuarios().length; i++){
        let re = new Registro();
        re.idUsuario = this.Service.getUsuarios()[i].idUsuario;
        re.nombres = this.Service.getUsuarios()[i].nombres;
        re.apellidos = this.Service.getUsuarios()[i].apellidos;
        this.registros.push(re);
      }
    }
    if(!(this.Service.getMembresias() === null)){
      for(let i in this.Service.getMembresias()){
        if(parseInt(this.Service.getMembresias()[i].monto.toString()) === 0) this.registros[i].membresia = "Activa";
        else this.registros[i].membresia = "Expirada";
        this.registros[i].expira = this.fecha(this.Service.getMembresias()[i].fechaExpiracion);

      }
      this.mostrar();
    }};
  }

  fecha(fecha:String):String{
    if(fecha === undefined) return "";
    let date = new Date(fecha.toString());
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
  }

  mostrar(){
    this.dataSource = new MatTableDataSource(this.registros);
  }

  filtrar(event: Event) {
    try{
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filtro.trim().toLowerCase();
    } catch (e:any) {
      console.log((e as Error).message);
    }
  }

  alertInformacion(id:number){
    this.dialog.open(DialogInformacion,{data:{us:this.Service.getUsuarios()[id]}})
  }

}

export class Registro{
  constructor(){}
  idUsuario:number;
  nombres:String;
  apellidos:String;
  membresia:String;
  expira:String;
}

@Component({
  selector: 'dialog-informacion',
  template: `
            <body>
              <div>
                <p class="title">Informacion del usuario</p>
                <p>Nombre Completo: {{this.nombre}}</p>
                <p>Edad: {{this.usuario.edad}}</p>
                <p>Genero: {{this.usuario.sexo}}</p>
                <p>Email: {{this.usuario.email}}</p>
                <p>Enfermadad: {{this.usuario.enfermedad}}</p>
              </div>
            </body>
            `,
  styleUrls:['style.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogInformacion {

  usuario:Usuario = new Usuario();
  nombre:String;

  constructor(public dialogRef: MatDialogRef<DialogInformacion>, @Inject(MAT_DIALOG_DATA) public data:Usuario,) {
    this.usuario = Object.values(data)[0];
    this.nombre = this.usuario.nombres+" "+this.usuario.apellidos;
  }

  salir(){ this.dialogRef.close(); }



}
