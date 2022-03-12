<?php
/**
 * @param myParam The parameter for the function
 * ? 
 * * Important
 * ! Felhantering
 * TODO: Fixa prepared statements
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

//* Kolla om metod är POST med roles
if (!isset($_POST['roles']))  {
    $error[] = "Bad indata. Roles saknas";
}

//* Kolla om roles är i array, inte är tom och sanitize
if (isset($_POST['roles'])) {
    
    if (!is_array($_POST['roles'])) {
        $error[] = "Bad indata, Roles måste vara i array";
    } else {
        $roles = array_map("htmlspecialchars", $_POST['roles']);

        //* Kontrollera om array innehåller något
        $antal_roller = count($roles);
        for ($i = 0; $i < $antal_roller; $i++) {
            if ($roles[$i] === "") {
                $error[] = "Bad indata, En roll får inte vara tom";
            }
        }
    }
}

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

//* Kolla om mail redan finns i DB
$sql = $db->prepare("SELECT * FROM employees WHERE Mail = '$mail'");
$sql->execute();
$resultat = mysqli_stmt_get_result($sql);

if ($resultat->num_rows > 0) {
    //* Meddela att användaren redan finns i DB
    $out->meddelande = ["$mail finns redan"];
    echo skickaJSON($out, 200);
    exit();
}

//* Lägg till ny mail i DB 
//TODO: Kommentera för att testa array 
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

//* Kolla om roles finns i tabell roles och ta fram deras id o lägg till i array
for ($i = 0; $i < count($roles); $i++) {
    $sql = $db->prepare("SELECT RoleID as id FROM roles WHERE Role = '$roles[$i]'");
    $sql->execute();
    $resultat = mysqli_stmt_get_result($sql);

    //* Om rollen finns i tabellen, lägg till i array
    if ($resultat->num_rows > 0) {
        $row = mysqli_fetch_assoc($resultat);
        $roller[] = $row['id'];
    } else {
        //! Meddela fel
        // TODO: Eller ska vi tillåta att fortsätta utan och lägga till?, nu fortsätter vi loppen.
        $out->error = ["Rollen $roles[$i] finns inte i tabellen roles"];
        # echo skickaJSON($out, 400);
        # exit();
    }
}


//* Om rollerna finns lägg till user och roll i tabell employee_roles och skicka tillbaka deras roll och roll id

if (count($roller) >= 1) {
    $out->roles = [];
    for ($i = 0; $i < count($roller); $i++) {
        $sql = $db->prepare("INSERT INTO employee_roles (EmployeeID, RoleID) VALUES ('$nyID', '$roller[$i]')");
        if  ($sql->execute()){
            $rec = ["Spara lyckades för $nyID med rollen $roles[$i]"];
            $out->roles[] = $rec;
        } else {
            //! Meddela fel
            $fel = $db->error;
            $out = new stdClass();
            $out->error = ["Fel vid spara", " $fel"];
            echo skickaJSON($out, 400);
            exit();
        }
    }
} else {
    //* om ingen roll är rätt ge employee Personal roll
    $sql = $db->prepare("INSERT INTO employee_roles (EmployeeID, RoleID) VALUES ('$nyID', '5')");
    if  ($sql->execute()){
        $rec = ["Spara lyckades för $nyID med grundrollen Personal"];
        $out->roles[] = $rec;
    } else {
        //! Meddela fel
        $fel = $db->error;
        $out->error = ["Fel vid spara", " $fel"];
        echo skickaJSON($out, 400);
        exit();
    } 
}

//* Skicka tillbaka json med svar om ok spara och avsluta
echo skickaJSON($out, 201);
exit();