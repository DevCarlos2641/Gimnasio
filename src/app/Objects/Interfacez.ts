export interface ResponsePhp{
  message: string,
  status: string,
}

export interface Registros{
  idUsuario:number;
  nombres:String;
  fechaPago:String;
  monto:number;
  pago:number;
  cambio:number;
  pdf:String;
}

export interface NameComplet{
  idUsuario:number;
  name:string
}
