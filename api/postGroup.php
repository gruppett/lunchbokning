<?php
/**
 * ? api för att lägga till en användare om den inte finns samt ge den en roll
 * @param POST['mail'] required
 * @param POST['role[]'] required
 * * Beskrivning av block
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
