import React, { useRef, useEffect } from "react";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
import RasterShadedReliefRenderer from "@arcgis/core/renderers/RasterShadedReliefRenderer";
import MultipartColorRamp from "@arcgis/core/tasks/support/MultipartColorRamp";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import ArcGISMap from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile";
import LayerList from "@arcgis/core/widgets/LayerList";
import Expand from "@arcgis/core/widgets/Expand";
import esriConfig from "@arcgis/core/config";

import "./App.css";

function App() {
  const settings = require("./settings.json");
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      esriConfig.apiKey = settings.esriAPI;
      const url =
        "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";
      var colorRamp = MultipartColorRamp.fromJSON(
        require("./MapComponents/colorRamp.json")
      );
      const renderer = new RasterShadedReliefRenderer({
        altitude: 45,
        azimuth: 315,
        hillshadeType: "traditional",
        zFactor: 1,
        scalingType: "adjusted",
        colorRamp: colorRamp,
      });

      const shadedRelief = new ImageryTileLayer({
        url: url,
        renderer: renderer,
      });
      var elevLyr = new ElevationLayer({
        // Custom elevation service
        url:
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/MtBaldy_Elevation/ImageServer",
      });

      const map = new ArcGISMap({
        basemap: "topo-vector",
        ground: "world-elevation"
      });
      map.ground.layers.add(elevLyr);
      const view = new SceneView({
        map,
        container: mapDiv.current,
        // zoom: 7,
        camera: {
          position: [-105.88905, 39.77419, 6346],
          heading: 0,
          tilt: 70
        }
      });

      const elevationProfile = new ElevationProfile({
        view: view,
        profileTaskUrl:
          "http://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer",
        // scalebarUnits: Units.MILES,
        profiles: [
          {
            type: "ground", // first profile line samples the ground elevation
          },
          {
            type: "view", // second profile line samples the view and shows building profiles
          },
        ],

        visibleElements: {
          selectButton: false,
        },
      });

      const elevationExpand = new Expand({
        view: view,
        content: elevationProfile,
        expanded: false,
        expandIconClass: "esri-icon-settings",
      });

      const layers = new LayerList({
        view: view,
      });

      const layersExpand = new Expand({
        view: view,
        content: layers,
        expanded: false,
        expandIconClass: "esri-icon-settings2",
      });

      view.ui.add(elevationExpand, "bottom-left");
      view.ui.add(layers, "top-right");
      map.addMany([shadedRelief]);
    }
  }, []);

  return (
    <div className="map-wrapper">
      <h1>Backcountry Trip Planner</h1>
      <div className="mapDiv" ref={mapDiv}></div>
    </div>
  );
}

export default App;
