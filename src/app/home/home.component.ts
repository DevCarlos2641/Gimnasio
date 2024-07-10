import { Component, Inject } from '@angular/core';
import { animate, style, transition, trigger, keyframes } from '@angular/animations';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface Item{
  imagenSrc: String;
  imagenAlt: String;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-500px)' }),
        animate('1000ms ease-out', keyframes([
          style({ opacity: 1, transform: 'translateY(200px)' }),
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
  ],
})
export class HomeComponent {
  show= true;

  dataImagen: Item[] = [];

    constructor(private dialog:MatDialog){}

    ngOnInit(){
      for(let i = 1; i < 14; i++){
        let item:Item = {imagenSrc:"./assets/images/Gym"+i+".jpg",
                        imagenAlt: "Imagen "+i};
        this.dataImagen.push(item);
      }
    }

    openDialog(open:String) {
      let dialogRef;
      if(open === "horario")
        dialogRef = this.dialog.open(DialogHorario);
      else if(open === "ubicacion")
        dialogRef = this.dialog.open(DialogUbicacion);
      else dialogRef = this.dialog.open(DialogInformacion);
    }

    dialogImg(src:String){
      const dialogRef = this.dialog.open(DiagloImg,{
        data:{url:src},});
    }
}

@Component({
  selector: 'dialog-horario',
  template: `
    <body>
      <h1> Horarios </h1>
      <h2>Lunes A Viernes</h2>
      <h3>6:00 Am - 11:00 Am</h3>
      <h3>3:00 Pm - 9:00 Pm</h3>
      <h2>Sabados</h2>
      <h3>7:00 Am - 12:00 Pm</h3>
    </body>`,
  styleUrls:['style.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogHorario {}

@Component({
  selector: 'dialog-ubicacion',
  template: `
    <body>
      <h1> Ubicacion </h1>
      <h3>Calle: Pedro Moreno 61</h3>
      <h3>Cp: 49370</h3>
      <h3>Amacueca Jalisco</h3>
    </body>`,
  styleUrls:['style.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogUbicacion {}

@Component({
  selector: 'dialog-informacion',
  template: ``,
  styleUrls:['style.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogInformacion {}

@Component({
  selector: 'dialog-img',
  template: `
    <body style="">
      <img [src]="src" style="width:100%; height: 700px;">
    </body>`,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DiagloImg{
  src:String;
  constructor(
    public dialogRef: MatDialogRef<DiagloImg>,
    @Inject(MAT_DIALOG_DATA) public data:String,) {
    this.src = Object.values(data)[0]
  }
}
