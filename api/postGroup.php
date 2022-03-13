<?php
/**
 * ? api för att lägga till en grupp
 * @param POST['email'] required, array?
 * @param POST['count'] required, array?
 * @param POST['vegetarians'] required, array?
 * @param POST['group_handler'] array?
 * * Beskrivning av block
 * ! Felhantering
 * TODO: Att göra / Ideer
*/

declare(strict_types=1);
require_once("functions.php");

//* Array för indata error kontroll
$error = [];

//* Kontrollera om anrops metod är POST
if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    //! Meddela fel
    $out = new stdClass();
    $out->error = ["Missing post data", "POST required"];
    echo skickaJSON($out, 405);                     
    exit();
}

//* Kolla om metod är POST med email
if (!isset($_POST['email'])) {
    $error[] = "Bad indata. email saknas";
} else {
    //* Filtrera, sanitize strängar och kolla att mail inte är tom.
    $mail = trim(filter_input(INPUT_POST, "mail", FILTER_SANITIZE_EMAIL));
    if ($mail === "") {        
        $error[] = "Bad indata, Mail får inte vara tom"; 
    }
    
    //* Kolla om metod är POST med group_handler annars lägg email som group_handler
    if (!isset($_POST['group_handler'])) {
        $group_handler =  $_POST['email'];
    }
}

//* Kolla om metod är POST med count
if (!isset($_POST['count'])) {
    $error[] = "Bad indata. Antal saknas";
} else {
    //* Filtrera, sanitize strängar och kolla att count inte är tom.
    $count = trim(filter_input(INPUT_POST, "count", FILTER_SANITIZE_NUMBER_INT));
    if ($count === "") {        
        $error[] = "Bad indata, Antal får inte vara tom"; 
    }
}

//* Kolla om metod är POST med vegetarians
if (!isset($_POST['vegetarian'])) {
    $error[] = "Bad indata. Antal vegetarian saknas saknas";
} else {
    //* Filtrera, sanitize strängar och kolla att count inte är tom.
    $vegetarian = trim(filter_input(INPUT_POST, "vegetarian", FILTER_SANITIZE_NUMBER_INT));
    if ($vegetarian === "") {        
        $error[] = "Bad indata, Antal vegetarian får inte vara tom"; 
    }
}

//* If group_handler post exists, check if empty and filter string. bind to variable. 
if (isset($_POST['group_handler'])) {
    $group_handler = htmlspecialchars($_POST['roles']);
    if ($group_handler === "") {
        $error[] = "Bad indata, group_handler får inte vara tom";
    }
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

// TODO: Kolla om email är Grupphandläggare

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

//* Skicka tillbaka json med svar om ok spara och avsluta
echo skickaJSON($out, 201);
exit();