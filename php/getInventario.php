<?php
        require_once("datosConexion.php");
        require("headers.php");
        $mysqli = new mysqli($host,$user,$pass,$database);

        $sql = "Select * from lubricantes order by Producto";

        $mysqli->set_charset("utf8");

        $datos=[];
        if ($result = $mysqli->query($sql))
        while ($dato = $result->fetch_assoc()) $datos[]=$dato;
        else $datos=array("Status"=>"error","MsjError"=>$mysqli->error,"Sql"=>$sql);

        echo json_encode($datos);
        $result->free();
        $mysqli->close();

         
?>