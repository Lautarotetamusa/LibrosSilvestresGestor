function hacerConsulta(sentencia, _url, action){

    var parametros = {
        "sentencia" : sentencia,
    };
    $.ajax({
            data:  parametros, //datos que se envian a traves de ajax
            url:   _url, //archivo que recibe la peticion
            type:  'post', //método de envio
            success:  function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
              var out = JSON.parse(response); //parseamos los datos a tipo JSON
              action(out);
           }
         });
}


var date_start = $("#date_start").val();
var date_final = $("#date_final").val();

var busqueda = $("input[name='busqueda']").val();

function acualizarValores(){
  date_start = $("#date_start").val();
  date_final = $("#date_final").val();

  busqueda = $("input[name='busqueda']").val();
}

function mostrarTabla(out){ //mostar la tabla
  var html = "";
  if(out.length > 0){
    var fontWeight = "style='font-weight: bold'";
    for(var i in out){
      if( i == 1 )
        fontWeight = "";
      html += "<tr " + fontWeight+">";
      for(var j in out[i]){
        html += "<td class='campos'>" +
                 out[i][j]+
                 "</td>";
      }
      html += "</tr>";
    }
  }
  else {
    html += "<h1>No se encontraron resultados</h1>";
  }
  return html;
}
