import jsPDF from "jspdf";
import { RegistroPdf } from "./RegistroPdf";

export class GenerarPdf{

    generar(registro:RegistroPdf, nombreC:String): jsPDF{
        //Variables por defauld
        var doc = new jsPDF();
        var img = "../assets/images/logo.png";
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        //
        doc.addImage(img, "png", width - 50, 10, 30, 30);

        doc.setFontSize(14);
        doc.setFont("time","bold");
        doc.text("Gobierno de Amacueca", 10, 10);
        doc.setFontSize(12);
        doc.setFont("time", "roman");
        doc.text("Gimansio Municipal", 10, 15);

        doc.setFontSize(14);
        doc.setFont("time", "bold")
        doc.text("Concepto: Pago por membresía en gimnasio", 10, 25);
        doc.setFontSize(12);
        doc.setFont("time", "roman");
        doc.text("Fecha: " + registro.fechaPago, 150, 50);
        doc.text("Folio: "+registro.folio, 150, 60);
        doc.text("Nombre completo: " + nombreC, 10, 30);
        doc.text("Monto pagado: $" + registro.monto, 10, 35);
        doc.text("Cambio entregado: $" + registro.cambio, 10, 40);

        doc.text("Firma", width / 2 - 5, 60)
        doc.text("__________________________________________________", width / 2 - 50, 70);
        doc.text(nombreC.toString(), width / 2 - nombreC.length, 75);
        doc.text("Firma", width / 2 - 5, 85);
        doc.text("__________________________________________________", width / 2 - 50, 95);
        doc.text("Encargado De Turno", width / 2 - 18, 100);
        return doc;
    }

}