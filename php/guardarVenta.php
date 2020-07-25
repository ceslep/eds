<?php
require_once("datosConexion.php");
require("headers.php");
$datos = json_decode(file_get_contents("php://input"));

$mysqli = new mysqli($host, $user, $pass, $database);
$sql = "INSERT INTO ventas (%s) values (%s); ";

$i = 0;
$sqli = "";
foreach ($datos as $dato => $value) {

        $valores = "";
        $campos = "";

        foreach ($value as  $dato => $valor) {
                if ($dato!='index'){
                $campos .= "$dato" . ",";
                $valores .= "'$valor'" . ",";
                }
        }
        $campos = substr($campos, 0, strlen($campos) - 1);
        $valores = substr($valores, 0, strlen($valores) - 1);
        $sqli .= sprintf($sql, $campos, $valores);
}

if ($mysqli->multi_query($sqli))
        $datos = array("Mensaje" => "Registros Insertados Correctamente", "SQL" => $sqli);
else
        $datos = array("Mensaje" => "Error", "MySQL Error" => $mysqli->error, "SQL" => $sqli);


echo json_encode($datos);

$mysqli->close();
