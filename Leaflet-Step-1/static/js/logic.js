// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

// Function to determine marker size based on earthquake intensity
function markerSize(magnitude) {
    return magnitude / 40;
}

// Function that will determine the color of a marker based on the magnitude of the earthquake
function chooseColor(magnitude) {
    switch (magnitude) {
    case (magnitude<1):
      return "light green";
    case (magnitude>1 && magnitude<2):
      return "yellow";
    case (magnitude>2 && magnitude<3):
      return "light orange";
    case (magnitude>3 && magnitude<4):
      return "Orange";
    case (magnitude>4 && magnitude<5):
      return "Dark Orange";
    default:
      return "Red";
    }
  }

//   // define the styles for the markers
// function markerStyle(feature) {
//     return {
//         L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
//             stroke: false,
//             fillOpacity: 0.75,
//             color: "white",
//             fillColor: chooseColor(feature.properties.mag),
//             radius: markerSize(feature.properties.mag)
//     }
//   }
// }

function createFeatures(earthquakeData) {
    earthquakemarker = [];
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        var circlemarker = L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: "white",
                fillColor: chooseColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            }).bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  
     return  circlemarker;  
    //   layer.bindPopup("<h3>" + feature.properties.place +
    //     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    //circlemarker.addTo(layer);
    }
    console.log(earthquakeData);
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
    property: onEachFeature
    });
    //  console.log(earthquakes);

    // .addTo(earthquakes);
    // earthquakes.addTo(circlemarker);
    // console.log(earthquakes);
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

// earthMappers = [];

function createMap(earthquakes) {
    
    //Define satellitemap, grayscalemap and outdoorsmap layers
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });
    
    var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    
    var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellitemap,
      "Grayscale": grayscalemap,
      "Outdoors": outdoormap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      //"Fault Lines": faultlines,
      "Earthquakes": earthquakes    

    };
  
    // Create our map, giving it the satellitemap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [satellitemap,earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    //Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
      });
      
      // When the layer control is added, insert a div with the class of "legend"
      info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
      };
      // Add the info legend to the map
      info.addTo(myMap);
  }

  