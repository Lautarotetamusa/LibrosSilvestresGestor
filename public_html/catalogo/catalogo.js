$("body").ready(function(){
  $("#buscar").click(function libros(){
      $("#tabla").html("");
      acualizarValores();

      var sentencia = " SELECT * FROM `libros`";

      if(busqueda != "")
        sentencia += " WHERE (`autor` LIKE '%"+busqueda+"%'"+
                          "OR titulo LIKE '%"+busqueda+"%');";

        hacerConsulta(sentencia, '../tablas.php', function(out){
          $("#tabla").append(mostrarTabla(out));

          //Agregar botones
          for(var i in out){
            var fila = $("#tabla").children().get(i);
            var boton = "<td><input class='boton' type='button' id='actualizar_libro"+i+"' name='info' value='Modificar'></td>";

            if( i == 0 )
              boton = "";

            fila.innerHTML += boton;
          }
          //EVENTOS
          for(var i in out){ //para cada fila
            $("#actualizar_libro"+i).click(function(){ //boton modificar
              var a = $(this)[0].id;//el id de este elemento
              var index = a.replace('actualizar_libro', '');//quitamos el actualizar libro
              var patern = $(this).parent().parent(); //la fila
              console.log(patern);
              var datos_libro = out[index]; //le sacamos el actualizar_libro

              var formu =
              "<div id='actualizar"+index+"'>" +
                    "<span class='titulos'>Stock:</span>  <input class='label' type='text' name='cantidad'><br>" +
                    "<span class='titulos'>Precio:</span>  <input class='label' type='text' name='precio' value=''><br>" +
                    "<input class='boton' type='button' name='enviar' value='actualizar'>" +
              "</div>";

              if($(this).val() == "Modificar"){
                $("#actualizar"+index).remove();

                patern.after(formu);

                $("input[name=enviar]").click(function(){ //evento actuliar del formulario
                  //ESTA PARTE SE PUEDE CAMBIAR
                  $.ajax({
                          data: { //datos que se envian a traves de ajax
                              "codigo" : datos_libro.cod,
                              "cantidad" : $("input[name=cantidad]").val(),
                              "precio" : $("input[name=precio]").val(),
                          },
                          url:   '../update.php', //archivo que recibe la peticion
                          type:  'post', //método de envio
                          success:  function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
                            for(var j in out){
                              $("#actualizar"+j).remove(); //borramos el formulario
                            }
                            $("#buscar").trigger("click"); //es como apretar el boton libros para actualizar la tabla
                            console.log(response);
                            alert("actualizado correctamente");
                         }
                       })
                });
                $(this).val("Cancelar");
              }
              else{
                $("#actualizar"+index).remove();
                $(this).val("Modificar");
              }
            });
          }
        });
    });

    $("#buscar").trigger("click");
  });
