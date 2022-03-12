<?php

declare(strict_types=1);

//* Koppla DB , Koppling eller false som svar
function kopplaDB()
{
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $dbHost = 'localhost';
    $dbUser = 'root';
    $dbPassword = '';
    $dbName = 'hjorten';
    $db = mysqli_connect($dbHost, $dbUser, $dbPassword, $dbName);
    $db->set_charset("utf8");
    return $db;
}

//* Skicka tillbaka JSON status
function skickaJSON(stdClass $obj, int $status = 200): string
{
    try {
        $statusText = getStatusMeddelande($status);
        header("$statusText; Content-type:application/json;charset=utf-8");
        $json = json_encode($obj, JSON_PRETTY_PRINT + JSON_UNESCAPED_UNICODE);
        return $json;
    } catch (Exception $e) {
        $statusText = getStatusMeddelande(500);
        header("$statusText; Content-type:application/json;charset=utf-8");
        return json_encode($e->getMessage());
    }
}

//* Hämta status meddelande
function getStatusMeddelande(int $status): string
{
    switch ($status) {
        case 200:
            return "HTTP/1.1 200 OK";
        case 201:
            return "HTTP/1.1 201 Created";
        case 204:
            return "HTTP/1.1 204 No Content";
        case 400:
            return "HTTP/1.1 400 Bad Request";
        case 401:
            return "HTTP/1.1 401 Unauthorized";
        case 403:
            return "HTTP/1.1 403 Forbidden";
        case 404:
            return "HTTP/1.1 404 Not Found";
        case 405:
            return "HTTP/1.1 405 Method Not Allowed";
        case 500:
            return "HTTP/1.1 500 Internal Server Error";
        default:
            throw new Exception("Okänt fel nummer ($status)");
    }
}
