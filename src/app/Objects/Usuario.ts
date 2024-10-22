export class Usuario{

    idUsuario:number = -1;
    nombres:String = "";            //In Table
    apellidos:String = "";          //In Table
    telefono:number = 0;        //In Table
    sexo:String = "";
    edad:number = 0;
    email:String = "";              //In Table
    enfermedad:String = "";
    nip:number = 0;

    verific(): String{
      if(this.nombres == "") return "El nombres";
      if(this.apellidos == "") return "Los apellidos";
      if(String(this.telefono).length < 10) return "El telefono";
      if(this.sexo == "") return "Sexo";
      if(this.edad == 0) return "La edad";
      if(this.email == "") return "El email";
      if(isNaN(this.nip) || this.nip == null) return "Su nip";
      return "";
    }

    refactStrings(){
      this.nombres = this.nombres.trim();
      this.apellidos = this.apellidos.trim();
      this.email = this.email.trim();
      this.enfermedad = this.enfermedad.trim();
    }
}
