$("body").ready(function(){
  $("#buscar").click(
    function libros(){
      $("#tabla").html("");
      acualizarValores();

      var sentencia = " SELECT * FROM `libros`";

      if(busqueda != "")
        sentencia += " WHERE (`autor` LIKE '%"+busqueda+"%'"+
                          "OR titulo LIKE '%"+busqueda+"%');";


        hacerConsulta(sentencia, '../tablas.php', function(out){
          $("#tabla").append(mostrarTabla(out)); //hacer la consulta y mostrar la tabla

          for(var i in out){
            var fila = $("#tabla").children().get(i);
            var boton = "<td><input class='boton' type='button' id='btn_agregar_libro"+i+"' value='Agregar'></td>";

            if( i == 0 )
              boton = "";

            fila.innerHTML += boton;
          }

          //agregar eventos
          for(var i in out){ //para cada fila
            $("#btn_agregar_libro"+i).click(function e(){ //boton modificar
              var a = $(this)[0].id; //el id de este elemento
              var datos_libro = out[ a.replace('btn_agregar_libro', '') ]; //le sacamos el btn_agregar_libro

              var fila = $(this).parent().parent();
              var formu = "<div class='bloque' id='bloque"+datos_libro.cod+"'>" +
                            "<span class='titulos'>Cantidad</span>  <input type='text' name='cantidad'><br>"  +
                            "<input  type='hidden' name='codigo' value=''><br>" +
                            "<input class='boton' style='width:200px' type='button' name='sacar' value='eliminar'<br>" +
                          "</div>";

              var titulo = "<h3 class='titulos_libros'>"+datos_libro.titulo+"</h3><br>";

              if($(this).val() == "Agregar"){
                $("#agregar").append(formu);
                $("#bloque"+datos_libro.cod).prepend(titulo);
                //console.log($("#bloque"+datos_libro.cod).children("input[name='codigo']"));
                var codigo = $("#bloque"+datos_libro.cod).children("input[name='codigo']");
                codigo.val(datos_libro.cod);
                $(this).val("Quitar");
              }
              else if($(this).val() == "Quitar"){
                $("#bloque"+datos_libro.cod).remove();
                $(this).val("Agregar");
              }

              $("input[name=sacar]").on("click", function(){
                $("#"+a).val("Agregar");
                $(this).parent().remove();
              });

            });
          }
        });
    }
  );
  $("input[name=vender]").click(function (){
    console.log("vendiendo");

    var cant_bloques = document.getElementsByClassName("bloque").length;
    if(cant_bloques > 1){ //si hay algo agregado

      var cantidad_array = Array();
      var codigo_array = Array();
      var formaPago = $("select[name=formaPago]").val();
      var descuento = $("input[name=descuento]").val();
      var nombre_cliente = $("input[name=nombre]").val();
      var cuil = $("input[name=cuil]").val();
      var email = $("input[name=email]").val();

      $("input[name='cantidad'").each(function (){
        cantidad_array.push($(this).val());
      });
      $("input[name='codigo'").each(function (){
        codigo_array.push($(this).val());
      });

      console.log($(".bloque"));
      $.ajax({
              data:  {//datos que se envian a traves de ajax
                  "cantidad" : cantidad_array,
                  "codigo"   : codigo_array,
                  "formaPago": formaPago,
                  "descuento": descuento,
                  "nombre"   : nombre_cliente,
                  "cuil"     : cuil,
                  "email"    : email
              },
              url:   'vender.php', //archivo que recibe la peticion
              type:  'post', //método de envio
              success:  function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
                $("#tabla").html("");
                $("#tabla").append(response);
                //alert("Productos Vendidos");

                $(".bloque").each(function (){
                    $(this).remove();
                });
             }
           });
    }
  });

  $("#buscar").trigger("click");
});
