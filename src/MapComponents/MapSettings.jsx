import React, {useState} from "react";
export default function ExpandContent(props) {
const {hillshadeType, setHillshadeType} = props;


  return (
<div id="mapSettings" className="esri-widget">
      <h3 className="esri-widget__heading">Shaded Relief Parameters</h3>
      <label className="esri-feature-form__label">Select type</label>
      <select id="hillshadeType" className="esri-input esri-select" value={hillshadeType} onChange={setHillshadeType}>
        <option value="traditional">
          traditional
        </option>
        <option value="multi-directional">multi-directional</option>
      </select>
      <br />
      <label id="zFactorLabel" className="esri-feature-form__label">
        Exaggeration Factor:
      </label>
      <div id="zFactor-slider" className="slider"></div>
      <div id="traditionalStuff">
        <label id="altitudeLabel" className="esri-feature-form__label">
          Sun Altitude:
        </label>
        <div id="altitude-slider" className="slider"></div>
        <label id="azimuthLabel" className="esri-feature-form__label">
          Sun Azimuth:
        </label>
        <div id="azimuth-slider" className="slider"></div>
      </div>
      <input type="checkbox" id="tinted" checked="true" />
      <label>Tinted hillshade</label>
      <br />
      <input type="checkbox" id="adjust" checked="true" />
      <label>Adjust for large scale</label>
    </div>
  );
}
