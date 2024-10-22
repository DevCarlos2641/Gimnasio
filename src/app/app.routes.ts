import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { UsuarioComponent } from './main/Menu/usuarios/usuarios.component';
import { HomeComponent } from './main/home/home.component';
import { MembresiaComponent } from './main/Menu/membresia/membresia.component';
import { FinanzasComponent } from './main/Menu/finanzas/finanzas.component';
import { LoginGuard } from './login/login-guardian';
import { RegisterListComponent } from './main/Menu/register-list/register-list.component';

export const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'Gimnasio', component:MainComponent, canActivate: [LoginGuard], children:[
    {path: 'Home', component: HomeComponent},
    {path: 'Usuario', component:UsuarioComponent},
    {path: 'Membresia/:id', component:MembresiaComponent},
    {path: 'Registros', component:RegisterListComponent},
    {path: 'Finanzas', component:FinanzasComponent},
  ]}
];
