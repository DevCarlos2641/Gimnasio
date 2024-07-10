import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { UsuarioComponent } from './Menu/Usuario/usuario';
import { ListaRegistrosComponent } from './Menu/lista-registros/lista-registros.component';
import { MembresiaComponent } from './Menu/membresia/membresia.component';
import { ModifiarDatosComponent } from './Menu/modifiar-datos/modifiar-datos.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FinanzasComponent } from './Menu/finanzas/finanzas.component';
import { VisitaComponent } from './Menu/visita/visita.component';
import { PaginaErrorComponent } from './pagina-error/pagina-error.component';
import { ServicioDataMYSQLService } from './Services/servicio-data-mysql.service';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginGuardian } from './login/login-guardian';
import { ListaMembresiasComponent } from './Menu/lista-membresias/lista-membresias.component';
import {MatRadioModule} from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from "@angular/router/testing";
import { ServiceDataService } from './Services/service-data.service';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { VistaClienteComponent } from './vista-cliente/vista-cliente.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const appMain: Routes = [
  {path: '', component: LoginComponent},
  {path: 'Home', component:HomeComponent},
  {path: 'Asistencia', component:AsistenciaComponent},
  {path: 'Cliente', component: VistaClienteComponent,
    children: [{path: 'Home', component:HomeComponent},
              {path: 'Asistencia', component:AsistenciaComponent}]},
  {path: 'Main', component: MainComponent, canActivate:[LoginGuardian],
    children: [{path:'Usuario', component: UsuarioComponent},
              {path: 'Registros', component: ListaRegistrosComponent},
              {path: 'ListaMembresias', component: ListaMembresiasComponent},
              {path: 'Membresia/:id', component: MembresiaComponent},
              {path: 'Modificar', component: ModifiarDatosComponent},
              {path: 'Finanzas', component:FinanzasComponent},
              {path: 'Visita', component:VisitaComponent}]},
  {path: '**', component: PaginaErrorComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    UsuarioComponent, ListaRegistrosComponent, MembresiaComponent, ModifiarDatosComponent,
    FinanzasComponent,
    MainComponent,
    HomeComponent,
    VisitaComponent, PaginaErrorComponent, LoginComponent, ListaMembresiasComponent, AsistenciaComponent, VistaClienteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appMain),
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatNativeDateModule, MatDatepickerModule,
    MatRadioModule, MatDialogModule],
  providers: [ ServicioDataMYSQLService, CookieService, LoginGuardian, ServiceDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
