<?php

    // configuration
    require("../includes/config.php");

    // if user reached page via GET (as by clicking a link or via redirect)
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        if (empty($_GET["lat"]) && empty($_GET["lng"]))
        {
            render("addplace_form.php", ["title" => "Add place", "lat" => "", "lng" => "", "placename" => "", "wiki" =>"", "spenttime" => ""]);
        }
        else if (empty($_GET["name"]))
        {
            render("addplace_form.php", ["title" => "Add place", "lat" => $_GET["lat"], "lng" => $_GET["lng"], "placename" => "", "wiki" =>"", "spenttime" => ""]);
        }
        else
        {
            if (empty($_GET["wiki"]))
            {
                $wiki = "";
            }
            else
            {
                $wiki = $_GET["wiki"];
            }
            if (empty($_GET["spenttime"]))
            {
                $spenttime = "";
            }
            else
            {
                $spenttime = $_GET["spenttime"];
            }
            query("DELETE FROM `sights` WHERE longitude = ? AND latitude = ?", $_GET["lng"], $_GET["lat"]);
            render("addplace_form.php", ["title" => "Add place", "lat" => $_GET["lat"], "lng" => $_GET["lng"], "wiki" => $wiki, "placename" => $_GET["name"], "spenttime" => $spenttime]);
        }
        
    }

    // else if user reached page via POST (as by submitting a form via POST)
    else if ($_SERVER["REQUEST_METHOD"] == "POST")
    {        
        // validate submission
        
        if (empty($_POST["long"]))
        {
            apologize("You must provide a longitude.");
        }
        else if (empty($_POST["lat"]))
        {
            apologize("You must provide a lattitude.");
        }
        else if (empty($_POST["name"]))
        {
            apologize("You must provide a lattitude.");
        }
        else if (empty($_POST["wiki"]))
        {
            $wiki = "";    
        }
        else
        {
            $wiki = $_POST["wiki"];
        }
        
        if (empty($_POST["time"]))
        {
            $time = "";
        }
        else
        {
            $time = $_POST["time"];
        }
        
        query("DELETE FROM `sights` WHERE longitude = ? AND latitude = ?", $_GET["long"], $_GET["lat"]);        

        if (query("INSERT INTO `sights` (longitude, latitude, wiki, name, time) VALUES(?, ?, ?, ?, ?)", $_POST["long"], $_POST["lat"], $wiki, $_POST["name"], $time) === false)
        {
            apologize("Couldn't create place for you.");
        }
            
        //redirect
        redirect("/");
    }

?>
