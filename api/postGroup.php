<?php
/**
 * ? api för att lägga till en användare om den inte finns samt ge den en roll
 * @param POST['name'] required, array?
 * @param POST['count'] required, array?
 * @param POST['vegetarians'] required, array?
 * * Beskrivning av block
 * ! Felhantering
 * TODO: Att göra / Ideer
*/

declare(strict_types=1);
require_once("functions.php");

//* Kontroll för indata array
$error = [];

//* Kontrollera om anrops metod är POST
if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    //! Meddela fel
    $out = new stdClass();
    $out->error = ["Missing post data", "POST required"];
    echo skickaJSON($out, 405);                     
    exit();
}

//* Kolla om metod är POST med name
if (!isset($_POST['name'])) {
    $error[] = "Bad indata. Name saknas";
}

//* Kolla om metod är POST med vegetarians
if (!isset($_POST['group_handler'])) {
    $error[] = "Bad indata. Antal vegetarian saknas saknas";
}

//* Kolla om metod är POST med count
if (!isset($_POST['count'])) {
    $error[] = "Bad indata. Antal saknas";
}

//* Kolla om metod är POST med vegetarians
if (!isset($_POST['vegetarians'])) {
    $error[] = "Bad indata. Antal vegetarian saknas saknas";
}


// TODO: Ska vi kolla om poster är i array för mass input / update / delete?

// TODO: Sanitize input

//* Ny class för json response
$out = new stdClass();

//* Indata fel?
if (count($error) > 0) {
    //! Meddela fel
    array_unshift($error, "Fel på indata");
    $out->error = $error;
    echo skickaJSON($out, 400); 
    exit();
}

//* Koppla till DB
if (!$db = kopplaDB()) {
    //! Meddela fel
   $fel = mysqli_connect_error();
   $out->error = ["Något gick fel vid databas kopplingen", $fel];
   echo skickaJSON($out, 500);
   exit();
}

//* Kolla om grupp redan finns i DB
// TODO: fix variabelnamn från copy / paste
$sql = $db->prepare("SELECT * FROM employees WHERE Mail = '$mail'");
$sql->execute();
$resultat = mysqli_stmt_get_result($sql);

if ($resultat->num_rows > 0) {
    //* Meddela att användaren redan finns i DB
    $out->meddelande = ["$mail finns redan"];
    echo skickaJSON($out, 200);
    exit();
}

//* Lägg till ny grupp i DB table groups
// TODO: Kommentera för att testa array
// TODO: fix variabelnamn från copy / paste och insert array?
$sql = $db->prepare("INSERT INTO employees (Mail) VALUES ('$mail')");

if ($sql->execute()) {
     $nyID = $db->insert_id;     
     $out->meddelande = ["Spara lyckades för $mail med ID $nyID"];
     #$out->id = $nyID;
} else {
    //! Meddela fel
    $fel = $db->error;
    $out = new stdClass();
    $out->error = ["Fel vid spara", " $fel"];
    echo skickaJSON($out, 400);
    exit();
}

// TODO: Lägg till primär grupphandläggare i DB table group_handlers