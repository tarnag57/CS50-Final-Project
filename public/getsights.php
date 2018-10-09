<?php

    require(__DIR__ . "/../includes/config.php");

    $sights[] = query("SELECT * FROM `sights`");
    
    // output articles as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($sights, JSON_PRETTY_PRINT));
    
?>
