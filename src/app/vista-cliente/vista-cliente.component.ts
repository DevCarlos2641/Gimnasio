import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent {

  constructor(private cookies:CookieService){}

  ngOnInit(){
    this.cookies.set("cliente", "true");
  }

}
