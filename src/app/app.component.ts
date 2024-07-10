import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ServiceDataService } from './Services/service-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
export class AppComponent {
  login:boolean = true;
  body:boolean = false;
  show:boolean = true;
  cliente:boolean = true;

  constructor(private cookies:CookieService, private router:Router,
            private service:ServiceDataService){}

  ngOnInit(){
    this.cookies.set("token", "");
  }

  logOut(){
    if(this.cookies.get("token") !== ""){
      this.cookies.set("token", "");
      this.router.navigate(['']);
    }
  }

  log(){
    if(this.cookies.get("token") === ""){
      this.router.navigate(['']);
    }
  }

  ngDoCheck(){
    let url = this.router.url.toString()
    if(url.split("/")[1] == "Cliente") this.cliente = false;
    else this.cliente = true;
  }

  routerHome(){
    let url = this.router.url.toString()
    if(url == "/Cliente/Asistencia" || url == "/Cliente"){
      this.router.navigate(['/Cliente/Home']);
      this.cookies.set("token", "");
    }
    else
      this.router.navigate(['/Home']);
  }

  routerCliente(){
    let url = this.router.url.toString();
    console.log(url);
    if(url == "/" || url == "/Main")
      this.router.navigate(["/Asistencia"]);
    else
    this.router.navigate(["Cliente/Asistencia"]);
  }

}

