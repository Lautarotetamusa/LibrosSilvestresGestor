<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>libros silvestres</title>
  </head>
  <body>
    <h1>productos vendidos</h1>
    <?php

      //datos libros
      $codigo = $_REQUEST['codigo'];
      $cantidad = $_REQUEST['cantidad'];

      //datos venta
      $formaPago = $_REQUEST['formaPago'];
      $descuento = $_REQUEST['descuento'];

      //datos cliente
      $nombre = $_REQUEST['nombre'];
      $cuil = $_REQUEST['cuil'];
      $email = $_REQUEST['email'];

      $consulta_valida = true;

      $precio_final = 0;

      $stock;
      $precio_unidad;
      $titulos;

      //abrimos la db
      $mysqli = new mysqli('localhost', 'root', 'Lautaro123.', 'libros_silvestres');
      $mysqli->set_charset("utf8");

      if( $descuento == ''){ //si no ponemos nada en descuento se asume 0
        $descuento = 0;
      }

      //sacamos la id de la venta que se va a hacer
      $id = $mysqli->query("SELECT * FROM `ventas` ORDER BY id DESC LIMIT 1")->fetch_object()->id+1;


      //buscar si el cliente ya existe
    /*  $cliente;
      echo "ELECT * FROM `clientes` WHERE `cuil` = $cuil";
      if( $cliente = $mysqli->query("SELECT * FROM `clientes` WHERE `cuil` = $cuil") ){
        echo "OK cliente: $cliente<br>";
      }
      else{
        echo "ERROR cliente<br>";
      }*/
      //echo "SELECT * FROM `clientes` WHERE `cuil` = $cuil";
      $cliente = $mysqli->query("SELECT * FROM `clientes` WHERE `cuil` = $cuil");
      if($cliente->num_rows  > 0){

        echo "el cliente ya estaba en la lista<br>";
        $cod_cliente = $cliente->fetch_object()->cod;
      }
      else{ // si el NO cliente existe lo creamos
        if($cuil == "") // si el cuil esta vacio agregamos un -1 q significa q no hay nada
          $cuil = -1;
        $crear_cliente = "INSERT INTO `clientes` (`nombre`, `cuil`, `email`)
                          VALUES('$nombre', '$cuil', '$email');";

        if( $mysqli->query($crear_cliente) ){
          //echo "OK: $crear_cliente<br>";
          $cod_cliente = $mysqli->query("SELECT * FROM `clientes` ORDER BY `cod` DESC LIMIT 1")->fetch_object()->cod;
          if($cod_cliente == ''){
            $cod_cliente = 0;
          }
        }
        else{
          //echo "ERROR: $crear_cliente<br>";
        }
      }



      //calculamos los precios de las unidades, los nuevos stocks y el precio final
      for ($i=0; $i < count($codigo) && $consulta_valida; $i++) { //Para cada libro ingresado
        $sacar_precio = "SELECT * FROM `libros` WHERE cod=".$codigo[$i].";"; //sacamos los datos del libro con su codigo

        if( $libro = $mysqli->query( $sacar_precio ) ){ //si la consulta esta bien hecha

          if( $libro->num_rows != 0 ){ //Si el codigo es correcto
            $obj = $libro->fetch_object();
            $precio_libro = $obj->precio;
            $stock[$i] = $obj->stock;
            $titulos[$i] = $obj->titulo;

            if( $cantidad[$i] == ''){
              $cantidad[$i] = 1;
            }

            $precio_unidad[$i] = ($precio_libro*$cantidad[$i]/100) * (100-$descuento);

            $precio_final += $precio_unidad[$i];

            $stock[$i]-=$cantidad[$i];

            if( $stock[$i] < 0 ){ //cuando no hay stock
              echo "no quedan suficientes de '$titulos[$i]'";
              $consulta_valida = false;
              //echo "<br><input class='boton' type='button' value='Volver' onclick='location.href=`index.html`'></input>";
            }
          }
          else { //Cuando el codigo esta mal
            echo "el codigo $codigo[$i] es incorrecto";
            $consulta_valida = false;
          //  echo "<br><input class='boton' type='button' value='Volver' onclick='location.href=`index.html`'></input>";
          }
        }
        else { //cuando la consulta esta mal
          echo "ERROR: $sacar_precio<br>";
        }
      }

      //Si la sentencia es valida hacamos la consulta
      if($consulta_valida == true){
        for ($i=0; $i < count($codigo) && $consulta_valida; $i++) {
           //si todos los libros cumplen con los requisitos
            //actualizamos la consulta
            $insertar = " INSERT INTO `contenido_ventas` (`cod_libro`, `cod_cliente`, `precio`, `cantidad`, `id_venta`)
                          VALUES ('$codigo[$i]', $cod_cliente, '$precio_unidad[$i]', '$cantidad[$i]', '$id');";


            $update_stock = " UPDATE `libros`
                              SET `stock`='$stock[$i]'
                              WHERE cod = '$codigo[$i]';
                            ";

            if( $mysqli->query( $update_stock ) ){
              if ( $mysqli->query( $insertar ) ){ //Todo salio bien
                //echo "OK: ".$insertar."<br>";
              //  echo "OK: ".$update_stock."<br>";
              }
              else {
                //echo "insert ERROR: ".$insertar."<br>";
                //echo "OK: ".$update_stock."<br>";
                $consulta_valida = false;
              }
            }
            else {
              //echo "update ERROR: ".$update_stock."<br>";
              $consulta_valida = false;
            }
        }
      }

      if($consulta_valida == true){

        echo "<span style='font-size: 20px; font-weight: bold'>venta realizada</span><br>";
        echo "<span style='font-size: 20px; font-weight: bold'>TOTAL: $$precio_final</span><br>";
        echo "forma de pago: $formaPago<br>";
        echo "descuento: $descuento%<br>";
        echo "se vendio: <br>";


        for ($i=0; $i < count($codigo); $i++) {
          echo $cantidad[$i]." '".$titulos[$i]."' por $".$precio_unidad[$i]."<br>";
        }

        $sentencia = "INSERT INTO `ventas`(`fecha`, `descuento`, `formaPago`, `s/f c/f`, `factura`, `precio`, `id`)
                      VALUES(CURRENT_DATE(), '$descuento', '$formaPago', 's/f','0', '$precio_final', '0');
                     ";

        if( $mysqli->query($sentencia) ){
        //  printf("OK: $sentencia<br>");
        }
        else{
        //  printf("ERROR: $sentencia<br>");
        }

        echo "<br><input class='boton' type='button' value='Realizar otra venta' onclick='location.href=`index.html`'></input>";
      }
      else{
        echo "NO SE PUDO VENDER";
          echo "<br><input class='boton' type='button' value='Volver a intentar' onclick='location.href=`index.html`'></input>";
      }

      $mysqli->close();
    ?>
  </body>
</html>
