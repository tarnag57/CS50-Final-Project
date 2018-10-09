<?php

    //lookup sight's lat and lng by sightname
    
    // configuration
    require("../includes/config.php");
    
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        if (empty($_GET["name"]))
        {
            http_response_code(400);
            exit;
        }
        
        $rows = query("SELECT * FROM `sights` WHERE name = ?", $_GET["name"]);
        
        header("Content-type: application/json");
        print(json_encode($rows, JSON_PRETTY_PRINT)); 
    }

?>
