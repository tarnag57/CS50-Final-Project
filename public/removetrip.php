<?php

    // configuration
    require("../includes/config.php");
  
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        if (empty($_GET["sightname"]))
        {
            http_response_code(400);
            exit;
        }
        
        $rows = query("SELECT * FROM `trip` WHERE sightname = ?", $_GET["sightname"]);

        if (empty($rows))
        {
            http_response_code(400);
            exit;
        }
        
        $sight= $rows[0];
        
        //determine length of curent trip
        $rows = query("SELECT * FROM `trip`");
        $length = count($rows);
            
        //remove from trip
        query("DELETE FROM `trip` WHERE sightname = ?", $_GET["sightname"]);
        
        dump($sight["number"]);
            
        //decrease number for the following rows
        for ($i = $sight["number"] + 1; $i < $length; $i++)
        {
            query("UPDATE `trip` SET `number` = ? WHERE `number` = ?", $i - 1, $i);
        }
    }   
?>
