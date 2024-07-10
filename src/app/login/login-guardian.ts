import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class LoginGuardian implements CanActivate {

    constructor(private cookies:CookieService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this.cookies.get("token") !== ""){
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }
    }

}