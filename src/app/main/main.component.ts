import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ApiService } from '../Services/api.service';
import { DataService } from '../Services/data.service';
import { Membresia } from '../Objects/Membresia';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule,
    RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(private Api:ApiService, private service:DataService, private cookies:CookieService){}

  ngOnInit(){

    // Cargando los datos del servidor...

    this.service.findUsuarios();

    this.service.findRegistrosPdf();

    this.service.findTransacciones();

    this.service.findMembresias();

    let membresiasUpdate = [];

    this.Api.Membresia.get().subscribe(membresias=>{
      if(membresias.length > 0){
        for(let i in membresias){
          if(this.membresiaExpired(membresias[i])){
            membresias[i].monto = 250;
            membresiasUpdate.push(membresias[i]);
          }
        }
        if(membresiasUpdate.length > 0)
          this.Api.Membresia.updateLote(membresiasUpdate).subscribe(re=>{
            this.service.findMembresias();
        })
      }
    });
  }

  membresiaExpired(membresia: Membresia):boolean{
    let dateM = new Date(String(membresia.fechaExpiracion)).getTime()+86400000;
    let hoy = new Date().getTime();
    if(dateM <= hoy) return true;
    return false;
  }

  logOut(){
    this.service.cleanData();
    this.cookies.set("token", "");
  }
}
