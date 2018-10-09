<?php

    // configuration
    require("../includes/config.php");
    

    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {        
        $rows = query("SELECT * FROM `sights` WHERE longitude = ? AND latitude = ?", $_GET["lng"], $_GET["lat"]);
        $row = $rows[0];
        $placename = $row["name"];
        
        render("remove_form.php", ["lat" => $_GET["lat"], "lng" => $_GET["lng"], "placename" => $placename]);
    }
    else if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        //remove from database
        query("DELETE FROM `sights` WHERE longitude = ? AND latitude = ?", $_GET["lng"], $_GET["lat"]);
    
        redirect("map.html");
    }
?>        
