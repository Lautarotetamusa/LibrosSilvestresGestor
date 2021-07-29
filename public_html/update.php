<?php
    $codigo = $_REQUEST['codigo'];
    $cantidad = $_REQUEST['cantidad'];
    $precio = $_REQUEST['precio'];


    $mysqli = new mysqli('localhost', 'root', 'Lautaro123.', 'libros_silvestres');
    $mysqli->set_charset("utf8");


    $sentencia = "UPDATE `libros`
                  SET `stock` = `stock` + '$cantidad'";

    if($codigo != ""){ //si el codigo no es vacio

     if($precio != "")
      $sentencia = $sentencia.", `precio` = '$precio'";

      $sentencia = $sentencia."WHERE cod = '$codigo';";

      echo $sentencia;
      if( $mysqli->query($sentencia) ){
        echo ("Actualizacion realizada correctamente");
      }
      else {
        echo ("Error en la actualizacion");
      }

    }
    else
      echo "el codigo esta mal";

    $mysqli->close();
?>
