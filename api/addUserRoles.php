<?php
/**
 * @param myParam The parameter for the function
 * ? 
 * * Important
 * ! Felhantering
 * TODO: employee.vegetarian saknas
 * TODO: fixxa array för roller
*/

declare(strict_types=1);
require_once("functions.php");

//* Kontroll för indata array
$error = [];

//* Kontrollera anrops metod är POST
if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    //! Meddela fel
    $out = new stdClass();
    $out->error = ["Missing post data", "POST required"];
    echo skickaJSON($out, 405);                     
    exit();
}

//* Kolla om metod är POST med mail
if (!isset($_POST['mail'])) {
    $error[] = "Bad indata. Mail saknas";
}

//* Filtrera, sanitize strängar och kolla att mail inte är tom.
if (isset($_POST['mail'])) {
    $mail = trim(filter_input(INPUT_POST, "mail", FILTER_SANITIZE_EMAIL));
    if ($mail === "") {        
        $error[] = "Bad indata, Mail får inte vara tom"; 
    } 
}

//* Kolla om metod är POST med roller och i array
if (!isset($_POST['roles']))  {
    $error[] = "Bad indata. Roller saknas";
}

//* Kolla om roller är i array och sanitize
if (isset($_POST['roles'])) {
    $roles = array_map("htmlspecialchars", $_POST['roles']);
    if (!is_array($roles)) {
        $error[] = "Bad indata, Roles måste vara i array";
    } else {
        
    }
}

//* Indata fel?
if (count($error) > 0) {
    //! Meddela fel
    array_unshift($error, "Fel på indata");
    $out = new stdClass();
    $out->error = $error;
    echo skickaJSON($out, 400); 
    exit();
}

// //* Filtrera, sanitize strängar för array
// if (isset($_POST['roles'])) {
//     $roles = array_map("htmlspecialchars", $_POST['roles']);
// }

//* Koppla till DB
if (!$db = kopplaDB()) {
     //! Meddela fel
    $fel = mysqli_connect_error();
    $out = new stdClass();
    $out->error = ["Något gick fel vid databas kopplingen", $fel];
    echo skickaJSON($out, 500);
    exit();
}

//* Kolla om mail redan finns i DB
$sql = $db->prepare("SELECT * FROM employees WHERE Mail = '$mail'");
$sql->execute();
$resultat = mysqli_stmt_get_result($sql);

if ($resultat->num_rows > 0) {
    //* Meddela att användaren redan finns 
    $out = new stdClass();
    $out->meddelande = ["$mail finns redan"];
    echo skickaJSON($out, 200);
    // TODO: ta bort kommentar
    #exit();
}

//* Lägg till ny mail i DB 
//! Bort kommenterad för att testa
// $sql = $db->prepare("INSERT INTO employees (Mail) VALUES ('$mail')");

// if ($sql->execute()) {
//     $nyID = $db->insert_id;
//     $out = new stdClass();
//     $out->meddelande = ["Spara lyckades för $mail"];
//     $out->id = $nyID;
// } else {
//     //! Meddela fel
//     $fel = $db->error;
//     $out = new stdClass();
//     $out->error = ["Fel vid spara", " $fel"];
//     echo skickaJSON($out, 400);
//     exit();
// }

//* Kolla om rollerna finns i tabell roles och ta fram deras id o lägg till i array
for ($i = 0; $i < count($roles); $i++) {
    #$roller = array();
    $sql = $db->prepare("SELECT RoleID as id FROM roles WHERE Role = '$roles[$i]'");
    $sql->execute();
    $resultat = mysqli_stmt_get_result($sql);

    //* Om rollen finns i tabellen, lägg till i array
    if ($resultat->num_rows > 0) {
        $row = mysqli_fetch_assoc($resultat);
        $roller[] = $row['id'];
    } else {
        //! Meddela fel
        $out = new stdClass();
        $out->error = ["Rollen $roles[$i] finns inte i tabellen roles"];
        echo skickaJSON($out, 400);
        exit();
    }

}

print_r($roller);

//* Om rollerna finns lägg till user och roll i tabell employeeroles
if (count($roller) >= 1) {

    for ($i = 0; $i < count($roller); $i++) {
        $sql = $db->prepare("INSERT INTO employeeRoles (EmployeeID, RoleID) VALUES ('$nyID', '$roller[$i]')");
        $sql->execute();
    }
}

echo skickaJSON($out);
exit();









if (isset($mail)) {
    /**
     * ! kan int lägga in $set som bind_param?
     */
    $sql = $db->prepare("UPDATE leverantorer SET $set WHERE leverantor_id LIKE ?");
    $sql->bind_param("i", $id);

    if ($sql->execute()) {
        if ($db->affected_rows === 0) {
            // Meddela fel
            $out = new stdClass();
            $out->error = ["Fel vid spara", " Företaget $foretagNamn ändrades inte"];
            echo skickaJSON($out, 400);
            exit();
        } else {
            $antal = $db->affected_rows;
            $out = new stdClass();
            $out->resultat = true;
            $out->meddelande = ["$antal poster uppdaterades"];
            echo skickaJSON($out);
            exit();
        }
    }
}