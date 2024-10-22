import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Admon } from '../Objects/Admon';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { animationLogin } from '../Animations/animation';
import { MatDialog } from '@angular/material/dialog';
import { DialogInformacion } from '../Dialogs/information.dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  animations:[animationLogin],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  show:boolean = true;
  buttonLogin:boolean = false;
  buttonSingUp:boolean = false;

  constructor(private Api:ApiService, private router:Router, private cookies:CookieService,
    private dialog:MatDialog){}

  singUp(form:NgForm){
    this.buttonSingUp = true;
    let admon = new Admon();

    admon.user = form.value.user;
    admon.password = form.value.password;

    this.Api.singUp(admon).subscribe(re=>{
      if(re.message != "Error"){
        this.cookies.set("token", re.status);
        this.router.navigate(['Gimnasio/Home']);
      } else this.alertDialog("Nombre De Usuario Ya Registrado");
      this.buttonSingUp = false;
    })
  }

  login(form:NgForm){
    this.buttonLogin = true;
    const admon = new Admon();
    admon.user = form.value.userL.toLowerCase();
    admon.password = form.value.passwordL;
    this.Api.authorization(admon).subscribe(re=>{
      this.buttonLogin = false;
      if(Object.values(re)[0] === 'error') { this.alertDialog("Usuario y/o Password Incorrecto"); return;}
      this.cookies.set("token", Object.values(re)[0]);
      this.router.navigate(['Gimnasio/Home']);
    })
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion,{data:{message:msg}});
  }

}
