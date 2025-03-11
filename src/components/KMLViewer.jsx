import React, { useEffect, useState } from "react";
import { KMLLoader } from "@loaders.gl/kml";
import { load } from "@loaders.gl/core";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

import fileSvg from '../assets/icons/file.svg'

const KMLViewer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [detailed, setDetailed] = useState(null);
  const [geoData, setGeoData] = useState([]);

  const [isSummaryClicked, setIsSummaryClicked] = useState(false);
  const [isDetailClicked, setIsDetailClicked] = useState(false);


  const [errMsg, setErrMsg] = useState('');


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    //resettinggg
    setIsSummaryClicked(false);
    setIsDetailClicked(false);
    setSummary(null)
    setDetailed(null);
    setGeoData(null);
    setErrMsg('');

  };

  const parseKMLFile = async (file, processFeatures) => {
    if (!file) {
      setErrMsg("A KML File is required");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const blob = new Blob([text], { type: "application/vnd.google-earth.kml+xml" });
        const parsedData = await load(blob, KMLLoader);
  
        if (!parsedData || !parsedData.features || !parsedData.features.length) {
          setErrMsg("Invalid or empty KML file");
          console.error("Invalid KML data:", parsedData);
          return;
        }
  
        setGeoData(parsedData.features);
        processFeatures(parsedData.features);
      } catch (error) {
        setErrMsg("Invalid KML File");
        console.error("Error parsing KML:", error);
      }
    };
  
    reader.onerror = (error) => {
      setErrMsg("Error reading file, can you try again");
      console.log("Error reading file:", error);
    };
  
    reader.readAsText(file);
  };


  const handleSummary = () => {
    parseKMLFile(file, (features) => {
      const counts = {};
      features.forEach((feature) => {
        const type = feature.geometry.type;
        counts[type] = (counts[type] || 0) + 1;
      });
  
      setSummary(counts);
      console.log(counts);
      setIsSummaryClicked(true);
    });
  };
  
  
  const handleDetailed = () => {

    parseKMLFile(file, (features) => {
      const details = {};
      features.forEach((feature) => {
        const type = feature.geometry.type;
  
        if (type === "LineString" || type === "MultiLineString") {
          const line = turf.lineString(feature.geometry.coordinates);
          const length = turf.length(line, { units: "kilometers" });
  
          details[type] = (details[type] || 0) + length;
        } else if (type === "Point" || type === "MultiPoint") {
          details[type] = (details[type] || 0) + feature.geometry.coordinates.length;
        }
      });
  
      setDetailed(details);
      setIsDetailClicked(true);
      console.log(details);
    });
  };
  

  useEffect(()=> {
    if (! errMsg) return;

    setTimeout(()=> {
      setErrMsg(null);
    },[3000])

  },[errMsg])

  

  return (
    <div className="p-2 w-full sm:w-1/2 sm:min-w-[500px] flex flex-col items-center ">
      <div className="relative my-2 max-w-80 ">

        <img src={fileSvg} alt="" className="absolute top-2 right-0" />
        <input type="file" accept=".kml" onChange={handleFileChange} className="rounded-xl shadow-xl  rounded-xl border border-gray-400 text-center p-2 " />
      </div>
      {/* <button className="bg-orange-500 px-4 py-2 rounded text-white" >Summary</button> */}
      {/* <button ></button> */}

      <div className="flex items-center justify-between mx-2 my-2 gap-10 ">


        <button
          onClick={handleSummary}
          class="relative overflow-hidden bg-transparent border border-orange-900 text-orange-900 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-orange-900 group">
          <span class="relative z-10">Get summary</span>
          <span class="absolute inset-0 rotate-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
        </button>

        <button
          onClick={handleDetailed}
          class="relative overflow-hidden bg-orange-900  font-semibold text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-orange-800 group">
          <span class="relative z-10">Detailed View</span>
          <span class="absolute inset-0 rotate-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
        </button>

      </div>

      {errMsg &&
      <p className="italic" > * {errMsg}</p>
      }


      {(isSummaryClicked) &&

        (

          (summary != null && Object.keys(summary).length > 0)
            ?
            <div className="w-full max-w-96">
              <h3 className="decoration underline my-2 capitalize">Summary Table</h3>
              <table className="border w-full">
                <thead className="border w-full">
                  <tr>
                    <th className="border font-semibold  ">Element Type</th>
                    <th className="border font-semibold" >Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary).map(([type, count]) => (
                    <tr key={type} className="border">
                      <td className="border text-center">{type}</td>
                      <td className="text-center">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            :
            <div className="font-medium"> No Summary found</div>

        )}



      {isDetailClicked &&
        (detailed && Object.keys(detailed).length > 0 ?

        <div className="w-full max-w-96 my-2">
            <h3 className="decoration underline my-2 capitalize"> Detailed Lengths</h3>
            <table className="border w-full">
            <thead className="border w-full">
                <tr className="border text-center " >
                  <th className="border font-semibold" >Element Type</th>
                  <th className=" font-semibold" >Total Length (km)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(detailed).map(([type, length]) => (
                  <tr key={type}>
                    <td className="text-center border">{type}</td>
                    <td className="text-center" >{length.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :
          <div> No Details Found </div>
        )
      }


      { detailed && geoData.length > 0 && (
        <MapContainer center={[20, 78]} zoom={5} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData.map((feature, index) => {
            if (feature.geometry.type === "Point") {
              return (
                <Marker key={index} position={feature.geometry.coordinates.reverse()}>
                  <Popup>Point</Popup>
                </Marker>
              );
            } else if (feature.geometry.type === "LineString") {
              return <Polyline key={index} positions={feature.geometry.coordinates} color="blue" />;
            } else if (feature.geometry.type === "MultiLineString") {
              return feature.geometry.coordinates.map((line, idx) => (
                <Polyline key={`${index}-${idx}`} positions={line} color="red" />
              ));
            }
            return null;
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default KMLViewer;
