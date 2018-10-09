<?php

    // configuration
    require("../includes/config.php");
    
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        if ((empty($_POST["type"])) || (empty($_POST["id"])))
        {
            http_response_code(400);
            exit;
        }
        
        if ($_POST["type"] == "up")
        {
            $id = $_POST["id"];
            query("UPDATE `trip` SET number = 0 WHERE number = ?", $id);
            query("UPDATE `trip` SET number = ? WHERE number = ?", $id, $id - 1);
            query("UPDATE `trip` SET number = ? WHERE number = 0", $id - 1);            
        }
        
        if ($_POST["type"] == "down")
        {
            $id = $_POST["id"];
            query("UPDATE `trip` SET number = 0 WHERE number = ?", $id);
            query("UPDATE `trip` SET number = ? WHERE number = ?", $id, $id + 1);
            query("UPDATE `trip` SET number = ? WHERE number = 0", $id + 1);            
        }
        
        if ($_POST["type"] == "delete")
        {
            $id = $_POST["id"];
            //remove from trip
            query("DELETE FROM `sights` WHERE id = ?", $id);
            
            $rows = query("SELECT * FROM `trip`");
            $length = count($rows);    
            
            //decrease number for the following rows
            for ($i = $id + 1; $i < $length; $i++)
            {
                query("UPDATE `trip` SET `number` = ? WHERE `number` = ?", $i - 1, $i);
            }
        }
    }
    

?>
