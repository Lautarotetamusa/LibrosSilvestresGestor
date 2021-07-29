$("body").ready(function(){
    $("#buscar").click(
      function ventas(){
        $("#tabla").html("");

        acualizarValores();

        var sentencia = "SELECT li.titulo, li.autor, fecha, formaPago, descuento, v.factura, cv.cantidad, cv.precio as 'precio de venta'";

        var sentenciaSuma = "SELECT sum(cv.precio), sum(cv.cantidad) ";

        var condiciones = "FROM `ventas` v " +
                          "INNER JOIN contenido_ventas cv " +
                          "INNER JOIN libros li " +
                          "WHERE v.id = cv.id_venta " +
                          "AND li.cod = cv.cod_libro";

        if( date_start != "" ){
          if( date_final != "" ){
              condiciones += " AND fecha >= '"+ date_start +"' AND fecha <= '"+date_final+"'";
           }
           else{
             condiciones += " AND fecha = '"+ date_start +"'";
           }
         }
         if(busqueda != ""){
           condiciones += " AND (li.autor LIKE '%" +busqueda+"%'"+
                           "OR li.titulo LIKE '%" +busqueda+"%');";
         }

         sentencia += condiciones;
         sentenciaSuma += condiciones;

         hacerConsulta(sentencia, '../tablas.php',function(out){
            $("#tabla").append(mostrarTabla(out));
          });

         //Sacar el total de precios
         hacerConsulta(sentenciaSuma, '../tablas.php', function(out){
           var html = "";
           var res_suma = out[1]["sum(cv.precio)"]; //obtenemos el valor suma
           var cantidadTotal = out[1]["sum(cv.cantidad)"]; //obtenemos el valor cantidad
           var suma = Math.round(res_suma*100)/100; //redondeamos el valor

           if(suma > 0){
             html = "<tr><td style='font-weight: bold' class='campos'>TOTAL</td>";

             //esto no me gusta como esta hecho
             for (var i = 0; i < 5; i++) {
               html += "<td class='campos'></td>";
             }

             html += "<td class='campos'>"+ cantidadTotal +"</td>";
             html += "<td class='campos'>"+ suma +"</td></tr>";
           }
           $("#tabla").append(html);
         });
      }
    );
    $("#buscar").trigger("click");
  });
