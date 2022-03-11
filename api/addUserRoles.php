<?php
//! employee.vegetarian saknas

declare(strict_types=1);

require_once("functions.php");

//* Kontrollera Indata Array
$error = [];

//* Kontrollera anrops metod är POST
if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    // Meddela fel
    $out = new stdClass();
    $out->error = ["Missing post data", "POST required"];
    echo skickaJSON($out, 405);
    exit();
}

//* Kolla om method är POST med mail
if (!isset($_POST['mail'])) {
    $error[] = "Bad indata. Mail saknas";
}

//* Kolla om method är POST med roller och i array
if ((!isset($_POST['roles'])) && (!is_array($_POST['roles']))) {
    $error[] = "Bad indata. Roller saknas eller är inte en array";
}

//* Filtrera, sanitize strängar och kolla att mail inte är tom.
$mail = trim(filter_input(INPUT_POST, "mail", FILTER_SANITIZE_EMAIL));
if ($mail === "") {
    // Meddela fel
    $error[] = "Fel vid spara, Mail får inte vara tom";
} 

//* Filtrera, sanitize strängar och kolla att rollerna inte är tom och i array
if (isset($_POST['roles'])) {
    $roles = array_map("htmlspecialchars", $_POST['roles']);
}

//* Indata fel?
if (count($error) > 0) {
    //* Meddela fel
    array_unshift($error, "Fel på indata");
    $out = new stdClass();
    $out->error = $error;
    echo skickaJSON($out, 400);
    exit();
}

//* Koppla till DB
if (!$db = kopplaDB()) {
    //* Meddela fel
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
    //* Meddela fel, mail finns redan
    $out = new stdClass();
    $out->error = ["Fel vid spara", " $mail finns redan"];
    echo skickaJSON($out, 400);
    exit();
}

//* Lägg till ny mail i DB 
$sql = $db->prepare("INSERT INTO employees mail VALUES ($mail)");

if ($sql->execute()) {
    $nyID = $db->insert_id;
    $out = new stdClass();
    $out->meddelande = ["Spara lyckades för $mail"];
    $out->id = $nyID;
} else {
    // Meddela fel
    $fel = $db->error;
    $out = new stdClass();
    $out->error = ["Fel vid spara", " $fel"];
    echo skickaJSON($out, 400);
    exit();
}



if (count($roles) > 0) {
    //* Lägg till roller i DB
    foreach ($roles as $rolle) {
        $sql = $db->prepare("INSERT INTO employee_roles (EmployeeID, RoleID) VALUES ($nyID, $rolle)");
        $sql->execute();
    }
}
for ($i = 0; $i < count($roles); $i++) {
    $sql .= $db->prepare("INSERT INTO employeesroles mail VALUES ($mail, $roles[$i])");
    
}


if ($sql->execute()) {
    $nyID = $db->insert_id;
    $out = new stdClass();
    $out->meddelande = ["Spara lyckades"];
    $out->id = $nyID;
    echo skickaJSON($out);
    exit();
} else {
    // Meddela fel
    $fel = $db->error;
    $out = new stdClass();
    $out->error = ["Fel vid spara", " $fel"];
    echo skickaJSON($out, 400);
    exit();
}

//* Lägg till roller i DB




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




