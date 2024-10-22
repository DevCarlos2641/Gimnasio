import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'dialog-informacion',
  template: `
  <div class="body">
    <p>{{this.message}}</p>
    <div>
      <button mat-raised-button (click)="salir()">Ok</button>
    </div>
  </div>`,
  styles: `
  .body{
    padding: 30px;
    font-family: 'Times New Roman', Times, serif;
  }
  p{
    font-size: x-large;
    padding: 20px;
  }
  div{
    text-align: end;
  }`,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogInformacion {

  message:String = "";

  constructor(public dialogRef: MatDialogRef<DialogInformacion>, @Inject(MAT_DIALOG_DATA) public data:String,) {
    this.message = Object.values(data)[0]
  }

  salir(){
    this.dialogRef.close();
  }

}
