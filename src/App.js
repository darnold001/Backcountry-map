import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  createContext,
} from "react";
import ShadedReliefSettings from "./MapComponents/ShadedReliefSettings";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
import TextSymbol from "@arcgis/core/symbols/TextSymbol"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import RasterShadedReliefRenderer from "@arcgis/core/renderers/RasterShadedReliefRenderer";
import MultipartColorRamp from "@arcgis/core/tasks/support/MultipartColorRamp";
// import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import ArcGISMap from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile";
import LayerList from "@arcgis/core/widgets/LayerList";
import Expand from "@arcgis/core/widgets/Expand";
import esriConfig from "@arcgis/core/config";

import "./App.css";
import { Disclamer } from "./disclamer";

function App() {
  const settings = require("./settings.json");
  const mapDiv = useRef(null);
  const url =
    "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";
  var colorRamp = MultipartColorRamp.fromJSON(
    require("./MapComponents/colorRamp.json")
  );
  const [shadedReliefOptions, setShadedReliefSettings] = useState({
    altitude: 45,
    azimuth: 315,
    hillshadeType: "traditional",
    scalingType: "adjusted",
  });

  const createMap = useCallback(() => {
    if (mapDiv.current) {
      esriConfig.apiKey = settings.esriAPI;

      const renderer = new RasterShadedReliefRenderer({
        altitude: shadedReliefOptions.altitude,
        azimuth: shadedReliefOptions.azimuth,
        hillshadeType: shadedReliefOptions.hillshadeType,
        zFactor: 1,
        scalingType: shadedReliefOptions.scalingType,
        colorRamp: colorRamp,
      });

      const shadedRelief = new ImageryTileLayer({
        url: url,
        renderer: renderer,
        // listMode: 'hide'
        visible: false
      });

      // New Feature Layer
      //Trailheads -  4b497329dfec4e3892c5b840ee9eee6a
      // Huts - 1d3dc8a899c34b21bbf8c4427bc21fb5

      // GOOD TOPO:
      // https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer?f=json

      // Will need this:
      // var basemap = new Basemap({
      //   baseLayers: [
      //     new WebTileLayer(...)
      //   ],
      //   referenceLayers: [
      //     new WebTileLayer(...)
      //   ],
      // });

      const map = new ArcGISMap({
        basemap: "topo-vector",
        ground: "world-elevation",
      });

      const trailheads = new FeatureLayer({
        url:
          "https://services8.arcgis.com/TfwdspNTLFJfnhhD/arcgis/rest/services/10th_Mountain_Division_Huts/FeatureServerhttps://services8.arcgis.com/TfwdspNTLFJfnhhD/arcgis/rest/services/10th_Mountain_Division_Huts/FeatureServer",
      });
      const huts = new FeatureLayer({
        url:
          "https://services8.arcgis.com/TfwdspNTLFJfnhhD/arcgis/rest/services/10th_Mountain_Division_Huts/FeatureServer",
      });
      const reportedSlides = new FeatureLayer({
        portalItem: {
          id: "11e0d9d321594bf182c0298dabb525d0",
        },
        layerId: 2,
      });

      const reportedAccidents = new FeatureLayer({
        // portalItem: {
        //   id: "68f1e631e4254f2d97bc07d7a752d418",
        // },
        url:
          "https://services2.arcgis.com/ublzbEZzdSwgC8aL/arcgis/rest/services/accidents_caic/FeatureServer",
        layerId: 2,
      });
      const view = new SceneView({
        map,
        container: mapDiv.current,
        // zoom: 7,
        camera: {
          position: [-105.88905, 39.77419, 6346],
          heading: 0,
          tilt: 55,
        },
      });

      const elevationProfile = new ElevationProfile({
        view: view,
        profileTaskUrl:
          "http://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer",
        // scalebarUnits: Units.MILES,
        profiles: [
          {
            type: "ground",
          },
          {
            type: "view", // second profile line samples the view and shows building profiles
          },
        ],

        visibleElements: {
          selectButton: false,
        },
      });
      const layers = new LayerList({
        view: view,
      });
      const elevationExpand = new Expand({
        view: view,
        content: elevationProfile,
        expanded: false,
        expandIconClass: "esri-icon-line-chart",
      });

      // const textSymbol = new TextSymbol({
      //   color: '#7A003C',
      //   text: 'ue634',  // esri-icon-map-pin
      //   // font: {  // autocast as new Font()
      //   //   size: 24,
      //   //   family: 'CalciteWebCoreIcons'
      //   // }
      // });

      const layersExpand = new Expand({
        view: view,
        content: layers,
        expanded: false,
        expandIconClass: "esri-icon-layers",
      });


      view.ui.add(elevationExpand, "bottom-left");
      view.ui.add(layersExpand, "top-right");
      map.addMany([
        shadedRelief,
        reportedSlides,
        // reportedAccidents,
        trailheads,
        huts,
      ]);
    }
  }, []);

  useEffect(() => {
    createMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map-wrapper">
      <h1>Backcountry Trip Planner</h1>
      <div className="mapDiv" ref={mapDiv} />
      <ShadedReliefSettings />
      <Disclamer/>
    </div>
  );
}

export default App;
