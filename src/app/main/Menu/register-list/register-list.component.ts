import { Component, Inject, ViewChild } from '@angular/core';
import { animationComponent } from '../../../Animations/animation';
import { MatInputModule } from '@angular/material/input';
import { DataService } from '../../../Services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Usuario } from '../../../Objects/Usuario';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-register-list',
  standalone: true,
  imports: [MatInputModule, MatTableModule, FormsModule, MatPaginatorModule],
  animations:[animationComponent],
  templateUrl: './register-list.component.html',
  styleUrl: './register-list.component.css'
})
export class RegisterListComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any;
  input:string = "";
  registros:Registro[] = [];
  columnas: string[] = ['id', 'nombres', 'membresia', 'expira'];

  constructor(private Service:DataService, private dialog:MatDialog){}

  ngOnInit(){
    const usuarios = this.Service.getUsuarios();
    const membresias = this.Service.getMembresias();
    if(usuarios.length == 0 || membresias.length == 0) return;

    for(let i in usuarios){
      const re:Registro = {
        idUsuario: usuarios[i].idUsuario,
        nombres: usuarios[i].nombres +" "+ usuarios[i].apellidos,
        membresia: membresias[i].monto == 0 ? "Vigente" : "Expirada",
        expira: membresias[i].fechaExpiracion.split(',')[0]
      }
      this.registros.push(re);
    }
    this.dataSource = new MatTableDataSource(this.registros);
    this.dataSource.paginator = this.paginator;
  }

  filtrar() {
    this.dataSource.filter = this.input.trim().toLowerCase();
  }

  alertInformacion(id:number){
    const reg = this.registros.filter(v=>v.idUsuario == id)[0]
    this.dialog.open(DialogInformationUser,{data:{us:this.Service.getUsuarioById(id), reg}})
  }
}

interface Registro{
  idUsuario:number;
  nombres:String;
  membresia:String;
  expira:String;
}

@Component({
  selector: 'dialog-informacion-user',
  template: `
    <div class="dialogBody">
        <p>{{this.nombre}}</p>
        <img [src] = 'pathImg' width="150px">
        <p>Edad: {{this.usuario.edad}}</p>
        <p>Genero: {{this.usuario.sexo}}</p>
        <p>Email: {{this.usuario.email}}</p>
        <p>Enfermadad: {{this.usuario.enfermedad}}</p>
        <p>Membresia: {{data.reg.membresia}}</p>
        <p>Fecha de expiracion: {{data.reg.expira}}</p>
    </div>
  `,
  styleUrl: './register-list.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
class DialogInformationUser {

  usuario:Usuario = new Usuario();
  nombre:String;
  pathImg:string;

  constructor(public dialogRef: MatDialogRef<DialogInformationUser>, @Inject(MAT_DIALOG_DATA) public data:any,) {
    this.usuario = data.us;
    this.nombre = this.usuario.nombres+" "+this.usuario.apellidos;
    this.pathImg = "./assets/images/"+this.usuario.sexo+".png";
  }

  salir(){ this.dialogRef.close(); }



}
