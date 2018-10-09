<h1>Complete the form to add place</h1>

<form action="addplace.php" method="post">
    <fieldset>
        <div class="form-group">
            <input id="lat" value="<?php echo htmlspecialchars($lat)?>" class="form-control" name="lat" placeholder="Lattitude" type="text"/>
        </div>
        <div class="form-group">
            <input id="long" autofocus value="<?php echo htmlspecialchars($lng)?>" class="form-control" name="long" placeholder="Longitude" type="text"/>
        </div>
        <div class="form-group">
            <input class="form-control" value="<?php echo htmlspecialchars($placename)?>" name="name" placeholder="Name" type="text"/>
        </div>
        <div class="form-group">
            <input id="wiki" class="form-control" value="<?php echo htmlspecialchars($wiki)?>" name="wiki" placeholder="Wiki article url (optional)" type="text"/>
        </div>      
        <div class="form-group">
            <input id="time" class="form-control" value="<?php echo htmlspecialchars($spenttime)?>" name="time" placeholder="Recommended time spent there (optional)" type="text"/>
        </div>          
        <div class="form-group">
            <button type="submit" class="btn btn-default">Save place</button>
        </div>
    </fieldset>
</form>
<div>
    or <a href="map.html">Plan route</a>
</div>
