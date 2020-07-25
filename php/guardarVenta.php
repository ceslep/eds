<?php
        require_once("datosConexion.php");
        require("headers.php");
        $datos=json_decode(file_get_contents("php://input"));
        $itemsVenta=json_decode($datos->itemsVenta);
        $mysqli = new mysqli($host,$user,$pass,$database);

        

        /*$sql = "Select * from clientes order by nombres";

        $mysqli->set_charset("utf8");

        $datos=[];
        if ($result = $mysqli->query($sql))
        while ($dato = $result->fetch_assoc()) $datos[]=$dato;
        else $datos=array("Status"=>"error","MsjError"=>$mysqli->error,"Sql"=>$sql);*/
        $datos=array("venta"=>"","items"=>$itemsVenta);
        echo json_encode($datos);
        //$result->free();
        $mysqli->close();

         
?>