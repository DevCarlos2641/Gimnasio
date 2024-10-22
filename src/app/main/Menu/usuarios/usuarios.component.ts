import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Membresia } from '../../../Objects/Membresia';
import { Usuario } from '../../../Objects/Usuario';
import { ApiService } from '../../../Services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DataService } from '../../../Services/data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { animationComponent } from '../../../Animations/animation';
import { DialogInformacion } from '../../../Dialogs/information.dialog';
import { MatButtonModule } from '@angular/material/button';
import { NameComplet } from '../../../Objects/Interfacez';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-usuario',
  standalone: true,
  animations: [animationComponent],
  imports: [MatInputModule, FormsModule, MatRadioModule, MatCheckboxModule, MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuarioComponent {

  // Variables para dar de alta un usuario
  usuario:Usuario = new Usuario();
  membresia:Membresia = new Membresia();
  cont:number;
  pathImg:String = "./assets/images/Mujer.png";

  //Variables para modificar datos de un user
  show = true;
  names:NameComplet[] = [];
  input:String = "";
  inputId:number;
  usuarioM:Usuario = new Usuario();

  constructor(private router:Router, private Api:ApiService,
    private Service:DataService, private dialog:MatDialog){}

  ngOnInit(){
    this.cont = this.Service.getUsuarios().length;
    this.names = this.Service.getNamesComplets();
    this.usuario.idUsuario = this.cont;
    this.membresia.idUsuario = this.cont;
  }

  changeEstudiante(){
    this.membresia.estudiante = !this.membresia.estudiante;
    if(this.membresia.estudiante) this.membresia.monto = 150;
    else this.membresia.monto = 250;
  }

  agregarUser(){
    const error = this.usuario.verific();
    if(error != "") return this.alertDialog("Favor de verificar "+error);
    this.usuario.refactStrings();

    this.Api.Usuario.insert(this.usuario).subscribe(re=>{
      if(re.message != "OK") return alert("Algo Fallo, Intentelo Nuevamente");
      this.Service.pushUsuario(this.usuario);
      this.Api.Membresia.insert(this.membresia).subscribe(re=>{
        if(re.message != "OK") return alert("Algo Fallo, Intentelo Nuevamente");
        this.Service.pushMembresia(this.membresia);
        this.alertDialog("El usuario "+this.usuario.nombres+" "+this.usuario.apellidos+
          " fue agregado ¡ Correctamente !");
        this.router.navigate(['/Gimnasio/Membresia', this.cont]);
      })
    })
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion,{
      data:{message:msg},});
  }

  change(){
    this.pathImg = "./assets/images/"+this.usuario.sexo+".png";
  }

  //                            Modific User

  buscarNombre(){
    this.inputId = Number("");
    const value = this.names.filter(v => {
      if(this.input.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
          v.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        return v
      else return "";
    });
    if(value.length > 0) this.usuarioM = this.Service.getUsuarioById(value[0].idUsuario);
    else this.usuarioM = new Usuario();
  }

  buscarId(){
    this.input = "";
    const value = this.names.filter(v => v.idUsuario == this.inputId);
    if(value.length > 0) this.usuarioM = this.Service.getUsuarioById(value[0].idUsuario);
    else this.usuarioM = new Usuario();
  }

  modificUser(){
    const error = this.usuarioM.verific();
    if(error != "") return this.alertDialog("Favor de verificar "+error);
    this.usuarioM.refactStrings();
    this.Api.Usuario.update(this.usuarioM).subscribe(re=>{
      if(re.message != "OK") return this.alertDialog("Algo Salio Mal, Porfavor Intente De Nuevo!")
      this.Service.updateUsuario(this.usuarioM);
      this.reset()
      this.alertDialog("Se Modifico Correctamente El Usuario");
      // this.router.navigate(['/Gimnasio/Membresia/'+this.usuario.idUsuario]);
    });
  }

  reset(){
    this.usuarioM = new Usuario;
    this.input = "";
    this.inputId = NaN;
  }
}
