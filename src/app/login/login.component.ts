import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServicioDataMYSQLService } from '../Services/servicio-data-mysql.service';
import { Router } from '@angular/router';
import { Admon } from '../Objects/Admon';
import { CookieService } from 'ngx-cookie-service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DialogInformacion } from '../Menu/DialogInformacion';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent {

  show:boolean = true;
  buttonLogin:boolean = false;
  buttonSingUp:boolean = false;

  constructor(private ServiceDataMysql:ServicioDataMYSQLService, private router:Router,
    private cookies:CookieService, private dialog:MatDialog){}

  singUp(form:NgForm){
    this.buttonSingUp = true;
    let admon = new Admon();

    admon.user = form.value.user;
    admon.password = form.value.password;

    this.ServiceDataMysql.singUp(admon).subscribe(re=>{
      if(re.message != "Error"){
        this.cookies.set("token", re.status);
        this.router.navigate(['Main']);
      } else this.alertDialog("Nombre De Usuario Ya Registrado");
      this.buttonSingUp = false;
    })
  }

  login(form:NgForm){
    this.buttonLogin = true;
    const admon = new Admon();
    admon.user = form.value.userL.toLowerCase();
    admon.password = form.value.passwordL;
    this.ServiceDataMysql.authorization(admon).subscribe(re=>{
      this.buttonLogin = false;
      if(Object.values(re)[0] === 'error') { this.alertDialog("Usuario y/o Password Incorrecto"); return;}
      this.cookies.set("token", Object.values(re)[0]);
      this.router.navigate(['Main']);
    })
  }

  alertDialog(msg:String){
    this.dialog.open(DialogInformacion,{data:{message:msg}});
  }

}
