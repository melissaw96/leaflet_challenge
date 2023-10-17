// Create tile layer of the map
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  //Fetch JSON data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data){
    createFeatures(data);    
});

//marker size by magnitude
function markerSize(magnitude){
    return magnitude * 25000;
};

function createFeatures (quakedata){
    function onEachFeature(feature, layer){
        layer.bindPopup(
        `<h3>location: ${feature.properties.place}
        <h3>date: ${new Date(feature.properties.time)}
        </p><p>magnitude: ${feature.properties.mag}
        </p><p>depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    var quakes = L.geoJSON(quakedata, {
        onEachFeature: onEachFeature,

        pointToLayer: function (feature, latlng){
            let markers = {
                fillcolor: changeColor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag),
                fillOpacity: 0.5,
                color: "black",
                weight: 0.5
            }
            return L.circle(latlng, markers);
        }
    });
    mapcreation(quakes)
};

function changeColor(depth) {
    if (depth < 10) return "##f0ed90";
    else if (depth < 30) return "#ffd519";
    else if (depth < 50) return "#fcae38";
    else if (depth < 70) return "#fc6f38";
    else if (depth < 90) return "#f55047";
    else return "#7e30f2";
};

function mapcreation(quakes) {
    let baseMaps = {
        "Street Map": streetmap,
        "Topographic Map": topo
    };
    let overLayMaps = {
        Earthquakes: quakes
    };

    let myMap = L.map("map",{
        center: [40, -75],
        zoom: 6,
        layers: [streetmap, quakes] 
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed:false
    }).addTo(myMap);
}





