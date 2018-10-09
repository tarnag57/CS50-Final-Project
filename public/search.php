<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];

    // TODO: search database for places matching $_GET["geo"]

    //prase geo
    $geo = str_getcsv($_GET["geo"]);
    
    //create query string
    $query = "SELECT * FROM places WHERE ";
    
    foreach ($geo as $data)
    {
        $query = $query . "((CONCAT(places.postal_code, places.place_name) LIKE '%" . $data . "%') OR (CONCAT(places.admin_name1, places.admin_name2) LIKE '%" . $data . "%') OR (CONCAT(places.admin_name3, places.admin_code1) LIKE '%" . $data . "%') OR (CONCAT(places.admin_code2, places.admin_code3) LIKE '%" . $data . "%') OR (CONCAT(places.latitude, places.longitude) LIKE '%" . $data . "%')) AND ";
    }
    
    //have to do something with the last end
    $query = $query . "(1=1)";
    
    //send query
    $places = query($query);

    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>
