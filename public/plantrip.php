<?php

    // configuration
    require("../includes/config.php");
    
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {

        if ((empty($_GET["lat"])) && ($_GET["lng"]))
        {
            http_response_code(400);
            exit;            
        }
        
        //select sight    
        $rows = query("SELECT * FROM `sights` WHERE latitude = ? AND longitude = ?", $_GET["lat"], $_GET["lng"]);
        
        if (empty($rows))
        {
            http_response_code(400);
            exit;            
        }
        
        $sight = $rows[0];
        
        // output sight as JSON (pretty-printed for debugging convenience)
        header("Content-type: application/json");
        print(json_encode($sight, JSON_PRETTY_PRINT));
        
    }
    
    //adding new sight to the trip
    else if($_SERVER["REQUEST_METHOD"] == "POST")
    {
    
        //error checking
        if (empty($_POST["time"]))
        {
            http_response_code(400);
            exit;
        }
        
        if (empty($_POST["name"]))
        {
            http_response_code(400);
            exit;
        }
        
        //search for sights
        $rows = query("SELECT * FROM `sights` WHERE name = ?", $_POST["name"]);
        if (empty($rows))
        {
            http_response_code(400);
            exit;
        }
        $sight = $rows[0];
        
        //if it's a new sight
        $rows = query("SELECT * FROM `trip` WHERE sightid = ?", $sight["id"]);
        if (empty($rows))
        {
            addsight($_POST["order"], $sight, $_POST["time"]);
        }
        else
        {

            $trip = $rows[0];

            //determine length of curent trip
            $rows = query("SELECT * FROM `trip`");
            $length = count($rows);
            
            //remove from trip
            query("DELETE FROM `trip` WHERE id = ?", $trip["id"]);
            
            //decrease number for the following rows
            for ($i = $trip["number"] + 1; $i < $length; $i++)
            {
                query("UPDATE `trip` SET `number` = ? WHERE `number` = ?", $i - 1, $i);
            }
            
            //add to trip
            addsight($order, $sight, $_POST["time"]);
        }
    
    }
    
    function addsight($order, $sight, $time)
    {
    
        if (empty($order))
        {
            //determine length of curent trip
            $rows = query("SELECT * FROM `trip`");
            $length = count($rows);                  
            
            query("INSERT INTO `trip` (number, sightid, sightname, time) VALUES (?, ?, ?, ?)", $length + 1, $sight["id"], $sight["name"], $time);            
        }
        else
        {
            //determine length of curent trip
            $rows = query("SELECT * FROM `trip`");
            $length = count($rows);
            
            //increase number values for rows after the sight
            $i = $length;
            
            while ($i > $order - 1)
            {
                query("UPDATE `trip` SET `number` = ? WHERE `number` = ?", $i + 1, $i);
                $i = $i - 1; 
            }        
            
            //add sight
            query("INSERT INTO `trip` (number, sightid, sightname, time) VALUES (?, ?, ?, ?)", $order, $sight["id"], $sight["name"], $time);
    
        }   
    }        
    
?>
