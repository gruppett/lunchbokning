<?php
/**
 * ? api för att lägga till en grupp
 * @param POST['mail'] required, array?
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

//* Kolla om metod är POST med mail
if (!isset($_POST['mail'])) {
    $error[] = "Bad indata. mail saknas";
} else {
    //* Filtrera, sanitize strängar och kolla att mail inte är tom. 
    if ($_POST['mail'] === "") {        
        $error[] = "Bad indata, Mail får inte vara tom"; 
    } else {
        $mail = trim(filter_input(INPUT_POST, "mail", FILTER_SANITIZE_EMAIL));
    }
    

}

//* Kolla om metod är POST med group_handler annars lägg mail som group_handler
if (isset($_POST['group_handler'])) {
    //* If group_handler post exists, check if empty and filter string. bind to variable. 
    if ($_POST['group_handler'] === "") {        
        $error[] = "Bad indata, group_handler får inte vara tom"; 
    } else{ 
        $group_handler = htmlspecialchars($_POST['group_handler']);
    }
}

//* Kolla om metod är POST med count
if (!isset($_POST['count'])) {
    $error[] = "Bad indata. Antal saknas";
} else {
    $count = trim(filter_input(INPUT_POST, "count", FILTER_SANITIZE_NUMBER_INT));
    //* Filtrera, sanitize strängar och kolla att count inte är tom.
    if ($_POST['count'] === "") {        
        $error[] = "Bad indata, Count får inte vara tom"; 
    } else {
       
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

//* Kolla om method är POST med namn
if (!isset($_POST['name'])) {
    $error[] = "Bad indata. Namn saknas";
} else {
    //* Filtrera, sanitize strängar och kolla att count inte är tom.
    if ($_POST['name'] === "") {        
        $error[] = "Bad indata, Name får inte vara tom"; 
    } else {
        $name = htmlspecialchars($_POST['name']);
    }
}
// TODO: Ska vi kolla om poster är i array för mass input / update / delete?

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

//* Om lägga till handläggare till gruppen Kolla om group_handler är Grupphandläggare
if (isset($_POST['group_handler'])) {
    $sql = "SELECT 
            *
            FROM 
                employee_roles er
            JOIN 
                roles r ON er.roleID = r.roleID
            JOIN 
                employees em ON er.employeeID = em.employeeID
            WHERE 
                em.mail = ? AND r.role = 'Grupphandledare'";

    //* Bind & prepare statement
    $prepare = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($prepare, 's', $group_handler);
    
    //* Execute sql
    mysqli_stmt_execute($prepare);
    $resultat = mysqli_stmt_get_result($prepare);

    //* Check if result has rows
    if (!$resultat->num_rows > 0) {
        //! Meddela fel
        $out->error = ["$group_handler är ingen grupphandledare"];
        echo skickaJSON($out, 400);
        exit();
    } else {
        echo "grupphandledare ";
    }
}

// //* Kolla om grupp redan finns i DB
// TODO: fix variabelnamn från copy / paste
$sql = "SELECT 
        *
        FROM 
            groups
        WHERE 
            name = ?";




$sql = $db->prepare("SELECT * FROM employees WHERE Mail = '$mail'");
$sql->execute();
$resultat = mysqli_stmt_get_result($sql);

if ($resultat->num_rows > 0) {
    //* Meddela att användaren redan finns i DB
    $out->meddelande = ["$mail finns redan"];
    echo skickaJSON($out, 200);
    exit();
}

// //* Lägg till ny grupp i DB table groups
// // TODO: fix variabelnamn från copy / paste och insert array?
// $sql = $db->prepare("INSERT INTO employees (Mail) VALUES ('$mail')");

// if ($sql->execute()) {
//     $nyID = $db->insert_id;     
//     $out->meddelande = ["Spara lyckades för $mail med ID $nyID"];
//     #$out->id = $nyID;
// } else {
//     //! Meddela fel
//     $fel = $db->error;
//     $out = new stdClass();
//     $out->error = ["Fel vid spara", " $fel"];
//     echo skickaJSON($out, 400);
//     exit();
// }

// // TODO: Lägg till primär grupphandläggare i DB table group_handlers

// //* Skicka tillbaka json med svar om ok spara och avsluta
// echo skickaJSON($out, 201);
// exit();