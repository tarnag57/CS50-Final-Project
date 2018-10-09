<h2>Are you sure you want to remove this place from the database? - <?php echo htmlspecialchars($placename) ?><h2>
<form action="remove.php?lat=<?php echo htmlspecialchars($lat)?>&lng=<?php echo htmlspecialchars($lng)?>" method="post">
    <fieldset>              
        <div id="yes" class="form-group">
            <button type="submit" class="btn btn-default">Yes</button>
        </div>
    </fieldset>
</form>
<form>
    <fieldset>              
        <div id="no" class="form-group">
            <button type="button" onclick="redirect()" class="btn btn-default">No</button>    
        </div>
    </fieldset>
</form>

<script>
    function redirect() {
        window.location.replace("map.html");
    }
</script>

