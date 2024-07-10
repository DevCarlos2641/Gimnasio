import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'dialog-informacion',
  templateUrl: 'dialog.html',
  styleUrls:['style.css'],
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
