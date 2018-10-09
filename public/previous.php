<?php

    require("../includes/config.php");
    
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        $rows = query("SELECT * FROM `trip`");
        
        if (empty($rows))
        {
            $data = "";
        }
        else
        {
            $data = $rows;
        }
        
        header("Content-type: application/json");
        print(json_encode($data, JSON_PRETTY_PRINT));
    }

?>
