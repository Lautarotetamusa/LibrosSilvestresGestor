$("body").ready(function(){
  $("#buscar").click(function facturas(){
      $("#tabla").html("");
      acualizarValores();

      var sentencia = "SELECT id, fecha, formaPago, descuento, factura, v.precio " +
                      "FROM `ventas` v ";

      if( date_start != "" ){
        if( date_final != "" ){
            sentencia += " WHERE fecha >= '"+ date_start +"' AND fecha <= '"+date_final+"'";
         }
         else{
           sentencia += " WHERE fecha = '"+ date_start +"'";
         }
       }
       sentencia +=  " ORDER BY v.fecha DESC";


       hacerConsulta(sentencia, '../tablas.php', function(out){
         $("#tabla").append(mostrarTabla(out));

         for(var i in out){
           var fila = $("#tabla").children().get(i);
           var boton = "<td><input class='boton' style='width:34px' type='button' id='info"+i+"' name='info' value='+'></td>";

           if( i == 0 )
             boton = "";

           fila.innerHTML += boton;
         }

         //Agregar los eventos a los botones
         for (var i in out) { //para cada fila
           $("#info"+i).click(function(){//agg eventos a los botones

             var a = $(this);
             var id = a[0].id;//el id de este elemento
             var index = id.replace('info', '');//quitamos el texto
             var patern = $(this).parent().parent(); //la fila
             var datos_libro = out[index]; //le sacamos el actualizar_libro

             //obtener la id de la tabla (es un asco hacerlo asi pero bueno)
             //var ID = patern.children().get(0).innerHTML;

             var detalles_libro = "SELECT li.cod, titulo, autor, cantidad, cv.precio as 'precio libro' " +
                                  "FROM `contenido_ventas` cv " +
                                  "INNER JOIN ventas v " +
                                  "INNER JOIN libros li " +
                                  "WHERE v.id = cv.id_venta " +
                                  "AND li.cod = cv.cod_libro " +
                                  "AND v.id = "+datos_libro.id;

             var detalles_cliente = "SELECT nombre, cuil, email " +
                                    "FROM clientes c " +
                                    "INNER JOIN `contenido_ventas` cv " +
                                    "INNER JOIN ventas v " +
                                    "WHERE v.id = cv.id_venta " +
                                    "AND c.cod = cv.cod_cliente " +
                                    "AND v.id = "+datos_libro.id +
                                    " LIMIT 1";

             if( a.val() == '+' ){ // si los detalles_libro estan ocultos
               //datos del libro
               hacerConsulta(detalles_libro,'../tablas.php',function(out){

               var html = "<tbody id='detalles_libro"+datos_libro.id+"' class='detalles_libro'>";

               if(out.length > 0){

                 html += mostrarTabla(out)+"</tbody>";
               }
               else{
                 html += "<tr><td class='campos' colspan='6'>no se encontraron resultados</td></tr></tbody>";
               }

               a.val("-");
               patern.after(html);
             });
             //datos del cliente
             hacerConsulta(detalles_cliente, '../tablas.php', function(out){
               if(out[1].num_rows != null);
                $("#detalles_libro"+datos_libro.id).append(mostrarTabla(out));
             });
           }
             else { // si los no detalles_libro estan ocultos
               $("#detalles_libro"+datos_libro.id).remove();
                a.val("+");
             }
           });
         }

        });
    });
    $("#buscar").trigger("click");
});
