<?php
  $sentencia = $_POST['sentencia'];

  $array = array();

  $mysqli = new mysqli('localhost', 'root', 'Lautaro123.', 'libros_silvestres');
  $mysqli->set_charset("utf8");

  if( $datos = $mysqli->query($sentencia) ){

    //guardar los nombres de los campos
    if($datos->num_rows > 0){
      $info_campos = $datos->fetch_fields(); //datos de los campos
      $nombre_campos = array(); //array q guarda los nombress
      foreach ($info_campos as $valor) {
        $nombre_campos[] = $valor->name;
      }
      $array[] = $nombre_campos;


      //guardar el contenido de los campos
      while ($fila = $datos->fetch_assoc()) {
          $array[] = $fila;
      }

      echo json_encode($array);
    }
    else{ //si no devuelve nada
      echo json_encode($datos);
    }
  }

  $mysqli->close();
?>
