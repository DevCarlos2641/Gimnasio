import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animationLogin } from './Animations/animation';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private cookies:CookieService){}

  ngOnInit(){
    // this.cookies.set("token", "");
  }

}
