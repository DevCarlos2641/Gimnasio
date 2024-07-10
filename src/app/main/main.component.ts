import { Component } from '@angular/core';
import { animate, style, transition, trigger, AnimationEvent, keyframes } from '@angular/animations';
import { Router } from '@angular/router';
import { ServiceDataService } from '../Services/service-data.service';
import { ServicioDataMYSQLService } from '../Services/servicio-data-mysql.service';
import { Membresia } from '../Objects/Membresia';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-500px)' }),
        animate('1000ms ease-out', keyframes([
          style({ opacity: 1, transform: 'translateY(220px)' }),
          style({ transform: 'translateY(-10px)' }),
          style({ transform: 'translateY(0px)' }),
        ])),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('1000ms ease-in', keyframes([
          style({ transform: 'translateY(-30px)', offset: 0.6 }),
          style({ opacity: 0, transform: 'translateY(500px)', offset: 1 }),
        ])),
      ]),
    ])
  ]
})
export class MainComponent {

  show = true;

  constructor(private router:Router, private service:ServiceDataService, private Api: ServicioDataMYSQLService){}

  ngOnInit(){

    // Cargando los datos del servidor...

    this.service.findUsuarios();

    this.service.findAsistencias();

    this.service.findRegistrosPdf();

    this.service.findTransacciones();

    let membresiasUpdate = [];

    // re = membresias
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

  cambiarView(url:String){
    this.router.navigate([url]);
  }
  cambiarMembresia(){
    this.router.navigate(['Main/Membresia', -1]);
  }
}
