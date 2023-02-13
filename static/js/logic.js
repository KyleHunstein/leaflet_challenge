// Initialize the map and set its view to the desired center and zoom level
var map = L.map("map").setView([0, 0], 2);

// Add a tile layer to the map using the OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
}).addTo(map);

// Get the earthquake data using an AJAX call
$.ajax({
    dataType: "json",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
    success: function(data) {
        console.log("Data received!");
        // Loop through the earthquake data and add a marker for each earthquake
        for (var i = 0; i < data.features.length; i++) {
            var earthquake = data.features[i];
            var latitude = earthquake.geometry.coordinates[1];
            var longitude = earthquake.geometry.coordinates[0];
            var magnitude = earthquake.properties.mag;
            var depth = earthquake.geometry.coordinates[2];

            // Set the marker size and color based on the magnitude and depth of the earthquake
            // Initialize the color scale
            var minDepth = d3.min(data.features, function(d) { return d.geometry.coordinates[2]; });
            var maxDepth = d3.max(data.features, function(d) { return d.geometry.coordinates[2]; });
            var colorScale = d3.scaleLinear()
            .domain([minDepth, maxDepth])
            .range(["blue", "red"]);

            var markerSize = magnitude * 5;
            var markerColor = colorScale(depth);

            // Add the marker to the map
            L.circleMarker([latitude, longitude], {
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.5,
                radius: markerSize
            }).addTo(map).bindPopup("<b>Magnitude: </b>" + magnitude + "<br><b>Depth: </b>" + depth + " km");
        }
        
        // Create the legend object
        var legend = L.control({ position: 'bottomright' });

        // Add the legend to the map
        legend.addTo(map);
    }
});
