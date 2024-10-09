(function () {
  // This was copied and pasted from the Lesson 3 module, as I like the style presented in this map over the other options.
  // I like the ability for the map information to be hidden via a button UI

  // get page elements
  const modal = document.querySelector("#modal");
  const button = document.querySelector("#button");
  const h1 = document.querySelector("h1");

  // display modal when button is clicked
  button.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // close modal when user clicks anywhere on the page
  modal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Set button UI
  buttonUI();

  // Add event listener for window resize
  // When page rotates or is resized, reset page UI
  window.addEventListener("resize", buttonUI);

  // map options
  const options = {
    zoomSnap: 0.1,
    center: [38.02, -84.48],
    zoom: 11.5,
    minZoom: 10,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false,
    latLngBounds: ([38.75, -85.0], [37.25, -84.0]),
  };

  // create the Leaflet map
  const map = L.map("map", options);

  // add zoom control as a button UI
  map.addControl(
    L.control.zoom({
      position: "bottomright",
    })
  );

  // create Leaflet panes for ordering map layers
  setPanes = ["bottom", "middle", "top"];
  setPanes.forEach((pane, i) => {
    map.createPane(pane);
    map.getPane(pane).style.zIndex = 401 + i;
  });

  // request a basemap tile layer with no labels and add to the map
  // or light_nolabels
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  // request a basemap tile layer with labels and add to the map but in a higher pane
  // Can use dark_only_labels, depends on choropleth color scheme
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      pane: "top",
    }
  ).addTo(map);

  // Might need to customize labels as it clashes with desired crash dots

  omnivore
    .csv("data/Fayette_2023Crashes_KABCO.csv")
    .on("ready", function (e) {
      drawMap(e.target.toGeoJSON());
    })
    .on("error", function (e) {
      console.log(e.error[0].message);
    });
  // end of Papa.parse()

  function processData() {
    // loop through all the crash data
    // add it to the map via a simple marker point
    // Use styles to define how to draw the crash data
    // need to also figure out how to programmatically access certain information about each crash, such as
    // if a pedestrian was struck (from DirAnalysisCode in the CSV)
    // need to sort out the collision date data outside of JavaScript (in Excel)
  } // end processData()

  function drawMap(data) {
    // create Leaflet object with geometry data and add to map
    // geometry will pull from the Latitude and Longitude feature properties of data

    // Extract lat/lng points for the heatmap layer
    const heatPoints = data.features.map(function (feature) {
      const lat = feature.geometry.coordinates[1]; // Latitude
      const lng = feature.geometry.coordinates[0]; // Longitude

      return [lat, lng]; // return lat lng for each crash
    });

    // Create the heatmap layer using Leaflet.heat
    const heat = L.heatLayer(heatPoints, {
      radius: 15,
      blur: 15,
      maxZoom: 17,
      zIndex: 900,
      gradient: {
        0.4: "cyan",
        0.55: "blue",
        0.85: "red",
        1.0: "yellow",
      },
    }).addTo(map); // Add the heat layer to the map

    // define point map options
    const options = {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          opacity: 0.4,
          weight: 1,
          fillOpacity: 0.25,
          fillColor: "#0063e4",
          color: "#ddd",
          zIndex: "400",
        });
      },
    };
    // add the data to the map
    crashes = L.geoJson(data, options).addTo(map);

    map.fitBounds(heat.getBounds(), {
      padding: [20, 20],
    });

    //
  } // end drawMap()

  function updateMap() {
    // Loop through each crash data
    // update the data to visualize it how the user wishes when they click on the UI
    // updateMap should also update the legend and what is displayed in the legend, including crash statistics for the displayed feature type
    // Need to also be able to showcase how to visualize the crashes based on attributes/properties defined in the processData function
    // that do not have their own field (pedestrian struck, crash with an animal, etc)
  } // end updateMap

  function drawLegend() {
    // drawLegend adds data from the updateMap, drawMap functions and displays it
    // drawLegend should also have feature counts displayed in the legend
  } // end drawLegend()

  function createSliderUI() {
    // create Leaflet control for the slider
    // The slider UI will show the crashes that occurred in specific months with 13 slider positions possible
    // The first slider position will show ALL crashes (and a div element that shows which time series data is being shown)
    // Slider positions/ticks 2-13 will show individual crashes that occurred in January - December, respectively.
  } // end createSliderUI()

  function buttonUI() {
    button.style.top = h1.offsetHeight + 20 + "px";
  }
})();
