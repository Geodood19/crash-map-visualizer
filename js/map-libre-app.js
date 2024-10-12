(function () {
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

  function buttonUI() {
    button.style.top = h1.offsetHeight + 20 + "px";
  }

  // Add event listener for window resize
  // When page rotates or is resized, reset page UI
  window.addEventListener("resize", buttonUI);

  const map = new maplibregl.Map({
    container: "map", // container id
    // emoji: dynamite!
    // this is the style that you'll want to replace with your own
    style:
      "https://api.maptiler.com/maps/0196b0e2-ea56-44ac-bf94-c9fb230df9ad/style.json?key=VR7FKTd6lXA4PKRQVzfY", // style URL
    center: [-84.5, 38], // starting position [lng, lat]
    zoom: 10, // starting zoom
  });

  // Load data from remote source using D3 and async/await
  async function fetchData() {
    const data = await d3.csv("../data/Fayette_2023Crashes_KABCO.csv");
    const sidecar = await d3.csv("../data/sidecar.csv");
    console.log(data, sidecar);
    createGeoJson(data, sidecar);
  }

  fetchData();

  function createGeoJson(data, sidecar) {
    const geojson = {
      type: "FeatureCollection",
      // map method returns a new array from the data array
      features: data.map(function (d) {
        const feature = {
          type: "Feature",
          properties: {
            KABCO: d.KABCO,
            STATS: `Injuries: ${d.NumberInjured} | Fatalities: ${d.NumberKilled}`,
            ID: d.IncidentID,
            xtra: "",
          },
          geometry: {
            type: "Point",
            coordinates: [+d.Longitude, +d.Latitude],
          },
        };
        // let's see if the sidecar files have a join and dump it into the properties
        let factors = {};
        // loop through the sidecar data
        sidecar.forEach(function (s) {
          if (s.id == d.IncidentID) {
            // decide which fields to use, sum, or count
            if (s.text1) {
              factors[s.text1] == 1
                ? factors[s.text1]++
                : (factors[s.text1] = 1);
            }
            if (s.text2) {
              factors[s.text2] = true;
            }
          }
        });
        // add the factors to the properties as string for the popup
        for (const f in factors) {
          feature.properties.xtra += `<li>${f}: ${factors[f]}</li>`;
        }
        // return the feature to the features array
        return feature;
      }),
    };

    // check the geojson
    console.log(geojson);

    // Add the data to the map after loading
    map.on("load", function () {
      // add source first
      map.addSource("crashes", {
        type: "geojson",
        data: geojson,
      });
      // add layer
      map.addLayer({
        id: "crashes",
        type: "circle",
        source: "crashes",
        paint: {
          "circle-radius": 5,
          // color circles by KABCO values
          // style expressions, check maplibre documentation: https://maplibre.org/maplibre-style-spec/expressions/ 
          "circle-color": [
            "match",
            ["get", "KABCO"],
            "1.0",
            "#FF0000",
            "2.0",
            "#ff7b00",
            "3.0",
            "#f5ee22",
            "4.0",
            "#05fa3a",
            "5.0",
            "#1953ff",
            "black",
          ],
          "circle-opacity": 0.75,
          "circle-stroke-width": 0.75,
          "circle-stroke-color": "#222"
        },
      });

      // add heat layer using mapLibre (Documentation: https://maplibre.org/maplibre-gl-js/docs/examples/heatmap-layer/)
      map.addLayer({
        // mapLibre to add layers
        id: "heatLayer", // what is this layer called?
        type: "heatmap", // what type of layer is being added to the map from MapLibre? 
        source: "crashes", // what is the source data for this layer? 
        paint: { // paint{} controls the colors 
          // color ramp for heatmap
          // begin color ramp at 0-stop with a 0-transparency color
          // to create blur-like effect
          // these were styles used in the sample, slightly tweaked
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgba(103,169,207,0.75)",
            0.4,
            "rgba(209,229,240,0.9)",
            0.7,
            "rgb(253,219,199)",
            0.9,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            6,
            10,
            15,
            20,
          ],
          // Transition from heatmap to circle layer by zoom level
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            9, // the most zoomed out zoom level will have... 
            0.9, // ...a 90% opacity on the heat layer (10% transparency), which will smoothly transition to... 
            14, // ...zoom level 14, which will have an opacity of.... 
            0, // 0%, or 100% transparent
          ],
        },
      });

      // Add a popup to the map
      map.on("click", "crashes", function (e) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const d = e.features[0].properties;
        let description = `<strong>KABCO:</strong> ${d.KABCO}<br>${d.STATS}<br>ID: ${d.ID}`;
        if (d.xtra) {
          description += `<br><strong>Factors:</strong><ul>${d.xtra}</ul>`;
        }
        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      map.on("mouseenter", "crashes", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "crashes", function () {
        map.getCanvas().style.cursor = "";
      });
    });

    crashStats(data);
  }

  // Function to calculate crash statistics
  function crashStats(data) {
    const stats = {
      KABCO: {},
      MannerofCollision: {},
      NumberKilled: 0,
      NumberInjured: 0,
    };
    data.forEach(function (d) {
      if (d.KABCO in stats.KABCO) {
        stats.KABCO[d.KABCO]++;
      } else {
        stats.KABCO[d.KABCO] = 1;
      }
      if (d.MannerofCollision in stats.MannerofCollision) {
        stats.MannerofCollision[d.MannerofCollision]++;
      } else {
        stats.MannerofCollision[d.MannerofCollision] = 1;
      }
      if (+d.NumberKilled) {
        stats.NumberKilled += +d.NumberKilled;
      }
      if (+d.NumberInjured) {
        stats.NumberInjured += +d.NumberInjured;
      }
    });

    console.log(stats);
  }
})();
