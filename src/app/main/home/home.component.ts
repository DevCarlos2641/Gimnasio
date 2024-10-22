import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Carousel } from './Carousel';
import { MatCardModule } from '@angular/material/card';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { animationComponent } from '../../Animations/animation';

@Component({
  selector: 'app-home',
  standalone: true,
  animations: [animationComponent],
  imports: [CarouselModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  images:any;
  customOptions:any;
  dialog:MatDialog = inject(MatDialog);

  ngOnInit(){
    let carousel = new Carousel()
    this.images = carousel.getImages(13);
    this.customOptions = carousel.customOptions;
  }

  showImage(src:string){
    this.dialog.open(DialogImage, {data:[src]});
  }

}

@Component({
  selector: 'dialog-image',
  template: `
    <img [src]="data[0]">
    <mat-icon class="icon" (click)="salir()">close</mat-icon>
    `,
  styles: `
  .icon{
    position: absolute;
    top: 15px;
    right: 15px
  }
  .icon:hover{
    background-color: rgba(255, 255, 255, 0.50);
    border-radius: 10px
  }`,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
class DialogImage {
  constructor(public dialogRef: MatDialogRef<DialogImage>, @Inject(MAT_DIALOG_DATA) public data:String,) {}

  salir(){
    this.dialogRef.close();
  }

}
