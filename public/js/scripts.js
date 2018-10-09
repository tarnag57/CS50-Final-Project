/**
 * scripts.js
 *
 * Computer Science 50
 * Problem Set 8
 *
 * Global JavaScript.
 */

// Google Map
var map;

// markers for map
var markers = [];

//new markers
var newmarkers = [];

//trip sights' markers
var trip = [];

//names of markers (in order of markers[])
var names = [];

//names of trip marekrs (in oreder of trip[])
var tripnames = [];

//markers' infowindows
var infowindows = [];

//content of panels
var htmlcontent;

//directions
var directionsService = [];
var directionsDisplay = [];  


// execute when the DOM is fully loaded
$(function() {
    
    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    

    
    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: {lat: 51.5160, lng: -0.1115}, // London city centre
        panControl: true,
        zoom: 13,
        zoomControl: true
    };

    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);

    //initialize text directions
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    
    //add searchbox    
        // Create the search box and link it to the UI element.
        var input = (document.getElementById("pac-input"));
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
                
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });
    
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
    
            if (places.length == 0) {
                return;
            }
    
            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
    
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
    
                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));
        
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    
    
    //add markers
    refresh();

});

function refresh()
{
    //set everything to null
    
    //get rid of widget
    var div_data = "";
    $("#widget").html(div_data);
    
    // Clear out the old markers.
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];
    
    trip.forEach(function(marker) {
        marker.setMap(null);
    });
    trip = [];
    
    infowindows = [];
    
    //replace markers
    //get places
    $.getJSON("getsights.php")
    .done(function (data){
        
        var length = data[0].length;
        
        for (var i = 0; i < length; i++)
        {
            addMarker(data[0][i].latitude, data[0][i].longitude, data[0][i].name, data[0][i].wiki, data[0][i].time);
        }
    
        //make trip's markers different        
        $.getJSON("previous.php")
        .done(function (data){
            
            for (var i = 0; i < data.length; i++)
            {
                var index = names.indexOf(data[i].sightname);
                addTrip(index, data[0].name);
                
                //change marker's properties
                marker = markers[index];
                marker.set('labelContent', data[i].number + '. ' + data[i].sightname);
                marker.set('icon', "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");                       
            }
            
        })
        
        //delete widget GUI
        widget();
        
        
    });


            
}

function markerPlace()
{
    var marker = new MarkerWithLabel({
        position: map.getCenter(map),
        map: map,
        draggable: true,
        labelClass: "labels",
    })
    
    marker.setMap(map);
    
    newmarkers.push(marker);
    
    var index = newmarkers.indexOf(marker);    
    
        //get cooridnates
        var lat = marker.getPosition().lat().toFixed(4);
        var long = marker.getPosition().lng().toFixed(4);
        
        //content of infowindow
        var infocontent = '<div id="content">' +
        lat + ', ' + long +
        '</div>' +
        '<p></p>' +
        '<div class="form-group">' +
            '<p> <button type="button" class="btn btn-default" onclick="addPlace(' + lat + ', ' + long + ')">Add as a sight</button> </p>' +
            '<button type="button" class="btn btn-default" onclick="removeMarker(' + index + ')">Remove marker</button>' +             
        '</div>';
        
        var infowindow = new google.maps.InfoWindow({
            content: infocontent
        });    
    
    //when marker is clicked add label
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);            
        
    });    
}

function removeMarker(index)
{
    newmarkers[index].setMap(null);    
    newmarkers[index] = null;
}


function manualSight()
{
    window.location.replace("addplace.php");
}

function addPlace(lat, long)
{
    window.location.replace("addplace.php?lat=" + lat + "&lng=" + long);
}


function getPlace()
{

}


/* Get markers from database */
function getMarkers()
{
    
    //get places
    $.getJSON("getsights.php")
    .done(function (data){
        
        var length = data[0].length;
        
        for (var i = 0; i < length; i++)
        {
            addMarker(data[0][i].latitude, data[0][i].longitude, data[0][i].name, data[0][i].wiki, data[0][i].time);  
        }
        
    });
    
}



/**
 * Adds marker for place to map.
 */
function addMarker(lat, lng, name, wiki, spenttime)
{
    
    //get coordinate
    var markerLatlng = new google.maps.LatLng(lat, lng);
      
    //specify marker's property
    var marker = new MarkerWithLabel({
        position: markerLatlng,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        labelContent: name,
        labelClass: "labels",
    })
    
    //add marker to map 
    marker.setMap(map);
    
    //add marker to markers[]
    markers.push(marker);
    
    //add name to names[]
    names.push(name)

    var index = markers.indexOf(marker);
    

        
        var infocontent;
        
        infocontent = 
        '<h1>' + 
            name + 
        '</h1>';
        
        if (wiki !== "")
        {
            infocontent = infocontent +
            '<div id="wiki">' +
                '<a href=' + wiki + '>Wikipedia webpage</a>' +
            '</div>';
        }
        
        if (spenttime !== "")
        {
            infocontent = infocontent +
            '<div id="spenttime">' +
                'Recommended time spent there: ' +
                spenttime +
            '</div>';
        }
        
        infocontent = infocontent +
        '<div class="form-group">' +
            '<p> <button type="button" class="btn btn-default" onclick="addTrip(' + index + ', \'' + name + '\'' + ')">Add it to your trip</button> </p>' +              
            '<p> <button type="button" class="btn btn-default" onclick="editSight(' + lat + ', ' + lng + ', \'' + name + '\'';
            if (wiki !== "")
            {
                infocontent = infocontent + ', ' + wiki;
            }
            if ((spenttime !== "") && (spenttime !== 0))
            {
                infocontent = infocontent + ', ' + spenttime;
            }
            infocontent = infocontent + 
            ')">Edit sight</button> ' +
            '<button type="button" class="btn btn-default" onclick="removeSight(' + lat + ', ' + lng + ')">Remove sight</button> </p>' +
        '</div>';
        
        var infowindow = new google.maps.InfoWindow({
            content: infocontent
        });        

        infowindows.push(infowindow);

    //when clicked  
    google.maps.event.addListener(marker, 'click', function() {                       
        infowindow.open(map,marker);
         
    });
    
}


function widget()
{
    $.getJSON("previous.php")
    .done(function(data)
    {
        
        var length = data.length
        
        var prev = [];
        
        for (var i = 0; i < length; i++)
        {
            var index = data[i].number;
            prev[index] = data[i];
        }
        
		/*Create new view that extends List and webix.ActiveContent*/
		webix.protoUI({
			name:"activeList"
		},webix.ui.list,webix.ActiveContent);
    
        webix.ui({
            container:"widget",
            rows: [
                {   
                    view: "form", 
                    elements: [
                        { view:"datepicker", label:"Start date", name:"date", stringResult:true },
                        { view:"datepicker", type:"time", label:"Start time", name:"time", stringResult:true },
                        { view:"select", label:"Vehicle", name:"vehicle", options:[
				            { value:"Driving", id:1 },
				            { value:"Public transport", id:2 },
				            { value:"Bicycle", id:3 },
				            { value:"On foot", id:4 } 
			            ]},
				        { view:"button", type:"form", value:"Get directions", click:function(){
					        var data = JSON.stringify(this.getParentView().getValues(),0,1);
					        directions(data);
				        }}			            
                    ]
                }, 
                { 
                    view:"activeList",
                    id:"list",
                    height:400, 
                    data:[],
                    autoheigth:true,
                    activeContent:{
                        downButton:{
                            id:"downButtonId",
                            view:"button",
                            value:"Down",
                            width:50,
                            click:downClick
                                                       
                        },
                        upButton:{
                            id:"upButtonId",
                            view:"button",
                            value:"Up",
                            width:50,
                            click:upClick
                                                       
                        },                        
				        deleteButton:{
					        id:"deleteButtonId",
					        view:"button",
					        value:"Delete",
					        width:70,
					        click:deleteClick
				        },   			                             
                    },
                    template:"<div><span>#title# - #time#</span>" +
                    "<span class='buttons'>{common.downButton()}</span>" +
                    "<span class='buttons'>{common.upButton()}</span>"+
                    "<span class='buttons'>{common.deleteButton()}</span></div>", 
                    type: {height:45},	                    
                }
            ]    
        });
        
        for (var i = 1; i < data.length + 1; i++)
        {
            $$("list").add({
                title: prev[i].sightname,
                time: prev[i].time,
                id: prev[i].number,
            });
        }
        
        function upClick(id, e){
			var item_id = $$('list').locate(e);
			listUp(item_id);
		}
		
		function downClick(id, e){
			var item_id = $$('list').locate(e);
			listDown(item_id);
		}
        
		function deleteClick(id, e){
			var item_id = $$('list').locate(e);
			listDelete(item_id);
		}
         
    });       
}

/* Widget functionality helper (access to database) */
function listUp(id)
{
    $.ajax({ 
        url:"list.php",
        type:"post",
        data:{id: id, type:"up"},
        success:function(){
            refresh();
        }
    });        
}

/* Widget functionality helper (access to database) */
function listDown(id)
{
    $.ajax({ 
        url:"list.php",
        type:"post",
        data:{id: id, type:"down"},
        success:function(){
            refresh();
        }    
    });                
}

/* Widget functionality helper (access to database) */
function listDelete(id)
{
    $.ajax({ 
        url:"list.php",
        type:"post",
        data:{id: id, type:"delete"},
        success:function(){
            refresh();
        }    
    });                
}


/* Running directions API */
function directions(specsString)
{

    //clear previous directions
    for (var i = 0; i < directionsDisplay.length; i++)
    {
        directionsDisplay[i].setMap(null);                    
    }
    
    directionsService = [];
    diretionsDisplay = [];

    //turn input into JSON object    
    var specs = JSON.parse(specsString);
    
    console.log(specs);

    //define travel mode
    var mode;
    if (specs.vehicle == 1)
    {
        mode = "DRIVING";
    }    
    else if (specs.vehicle == 2)
    {
        mode = "TRANSIT";
    }
    else if (specs.vehicle == 3)
    {
        mode = "BICYCLING";
    }
    else if (specs.vehicle == 4)
    {
        mode = "WALKING";
    }
    
    //change height of widget
    $$("list").config.height = 160;
    $$("list").resize();
    
    //get trip sights
    $.getJSON("previous.php")
    .done(function(data) {
    
        var prev = [];
        
        for (var i = 0; i < data.length; i++)
        {
            var index = data[i].number;
            prev[index - 1] = data[i];
        }
        
        var length = prev.length;
        
        //define starting time
        var currentTime = Date.parse(specs.date)/1000 + 4 * 3600;
        console.log(currentTime);
        
        var marker = trip[0];
        var text = marker.labelContent;
        
        nextroute(currentTime, 0, prev, mode);


    });        
}

/* */
function nextroute(currentTime, i, prev, mode)
{
    if (i < prev.length - 1)
    {
            var spenttime = "1970-01-01T0" + prev[i].time +":00+00:00";
            spentdate = (new Date(spenttime))/1000;
            
            currentTime = currentTime + spentdate;
            
            directionsService[i] = new google.maps.DirectionsService;
            directionsDisplay[i] = new google.maps.DirectionsRenderer;  
            directionsDisplay[i].setMap(map);  
            directionsDisplay[i].setOptions( { suppressMarkers: true } );          

            route(prev, i, currentTime, mode, directionsService[i], directionsDisplay[i]);
    }
    
}


/* Add route (helper function of directions())*/
function route(prev, i, currentTime, mode, directionsService, directionsDisplay)
{


    var newTime;

    //set content of widget to null
    //$('#widget').html("");
    
    //add directions panel
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    
    //lookup place
    $.getJSON("lookup.php?name=" + prev[i].sightname)
    .done(function(data) {
    var sight1 = data[0];
                    
       $.getJSON("lookup.php?name=" + prev[i+1].sightname)
        .done(function(data) {
            var sight2 = data[0];
            
            var sight1Latlng = new google.maps.LatLng(sight1.latitude, sight1.longitude);
            var sight2Latlng = new google.maps.LatLng(sight2.latitude, sight2.longitude);

            //make timestamp into date
            var currentDate = new Date(currentTime * 1000);

            //draw route
            var selectedMode = mode;
            directionsService.route({
                origin: sight1Latlng,
                destination: sight2Latlng,
                travelMode: google.maps.TravelMode[selectedMode],
                transitOptions :
                {
                      departureTime: currentDate,
                },
            }, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    newTime = response.routes[0].legs[0].duration.value;
                    directionsDisplay.setDirections(response);
                    currentTime = currentTime + newTime;
                    nextroute(currentTime, i + 1, prev, mode);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });            
                                        
        });        
    });

}


/* Add sight to the trip */
function addTrip(index, name)
{
    var marker = markers[index];
    
    trip.push(marker);
    
    //get cooridnates
    var lat = marker.getPosition().lat().toFixed(4);
    var lng = marker.getPosition().lng().toFixed(4);    

        var sight;
        
        $.getJSON("plantrip.php?lng="+lng+"&lat="+lat)
        .done(function(data) {
            sight = data;
            
            var name = sight.name
            
            var prev = [];
        
            $.getJSON("previous.php")
            .done(function(data) {
                
                for (var i = 0; i < data.length; i++)
                {
                    var newindex = data[i].number - 1;
                    prev[newindex] = data[i];
                }
                
                var infocontent = 
                '<h1>' + 
                     name +
                '</h1>' +
                '<form id="myForm' + index + '">' +
                    '<fieldset>' +
                        '<div class="form-group">' +
                            '<input id="name" value="' + sight.name + '" class="form-control" name="name" placeholder="Name" type="text" readonly/>' +
                        '</div>' +
                        '<div>Time:</div>' +
                        '<div class="form-group">' +
                            '<input id="time" value="' + sight.time + '" class="form-control" name="time" placeholder="Time" type="text" required/>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<select class="form-control" name="order">' +
                                '<option value="">Add it to the end</option>';
                                for (var i = 0; i < prev.length; i++)
                                {
                                    infocontent = infocontent +
                                    '<option value=' + prev[i].number + '>Add it before ' + prev[i].sightname + '</option>';
                                }
                        infocontent = infocontent +
                            '</select>' +
                        '</div>' +            
                        '<div class="form-group">' +
                            '<button type="button" onclick="SubForm(' + index +')" class="btn btn-default">Save</button> ' +
                            '<button type="button" onclick="removeForm( \'' + name + '\', ' + index + ')" class="btn btn-default">Remove from trip</button>' +
                        '</div>' +
                    '</fieldset>' +
                '</form>';   
                
                infowindows[index].setContent(infocontent);
                
            });
        });

} 

function SubForm(index) {
    
    var data = $("#myForm" + index).serialize();
    
    trip.push(markers[index]);    
    
    $.ajax({ 
        url:"plantrip.php",
        type:"post",
        data:data,
        success:function(){
            refresh();
        }
    });
}    

/* Remove from trip */
function removeForm(name, index)
{
    $.ajax({
        url:"removetrip.php?sightname=" + name,
        type:"get",
        success:function(){
            
            refresh();
        }
    });
}

/* Edit sight */
function editSight(lat, lng, name, wiki, spenttime)
{   
    if (wiki === undefined)
    {
        wiki = "";
    }
    if (spenttime === undefined)
    {
        spenttime = "";
    }

    window.location.replace("addplace.php?lat=" + lat + "&lng=" + lng + "&name=" + name + "&wiki=" + wiki + "&spenttime=" + spenttime);    
}

/* remove sight */
function removeSight(lat, lng)
{
    window.location.replace("remove.php?lat=" + lat + "&lng=" + lng);
}


/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // remove markers whilst dragging
    google.maps.event.addListener(map, "dragstart", function() {
        removeMarkers();
    });

    // configure typeahead
    // https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md
    $("#q").typeahead({
        autoselect: true,
        highlight: true,
        minLength: 1
    },
    {
        source: search,
        templates: {
            empty: "no places found yet",
            suggestion: _.template("<p><%- place_name %>, <%- admin_name1 %>, <%- postal_code %></p>")
        }
    });

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // ensure coordinates are numbers
        var latitude = (_.isNumber(suggestion.latitude)) ? suggestion.latitude : parseFloat(suggestion.latitude);
        var longitude = (_.isNumber(suggestion.longitude)) ? suggestion.longitude : parseFloat(suggestion.longitude);

        // set map's center
        map.setCenter({lat: latitude, lng: longitude});

        // update UI
        update();
    });

    // hide info window when text box has focus
    $("#q").focus(function(eventData) {
        hideInfo();
    });

    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

    // give focus to text box
    $("#q").focus();
}

/**
 * Hides info window.
 */
function hideInfo()
{
    info.close();
}

/**
 * Removes markers from map.
 */
function removeMarkers()
{
    for (var i = 0; i < markers.length; i++)
    {
        markers[i].setMap(null);
    }
    markers.length = 0;
    
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, cb)
{
    // get places matching query (asynchronously)
    var parameters = {
        geo: query
    };
    $.getJSON("search.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // call typeahead's callback with search results (i.e., places)
        cb(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content)
{
    // start div
    var div = "<div id='info'>";
    if (typeof(content) === "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='img/ajax-loader.gif'/>";
    }
    else
    {
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON("update.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // remove old markers from map
        removeMarkers();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addMarker(data[i]);
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
};
