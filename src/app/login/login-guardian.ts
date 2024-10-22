import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
  class TokenClass{
    constructor(private cookies:CookieService){}
    canActivate():boolean{
      let token:string  = this.cookies.get("token");
      if(token === "") return false;
      return true;
    }
}

export const LoginGuard: CanActivateFn = (route, state) => {
  return inject(TokenClass).canActivate();
};
