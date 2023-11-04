import axios, { AxiosResponse } from "axios";
import { LatLngBounds, Map } from "leaflet";
import { BBox } from "geojson";

export interface OverPassDataType {
  elements: OverPassElementType[];
  generator: string;
  version: number;
  osm3s: object;
}

export type Latlon = { lat: number; lon: number };

export interface OverPassElementType {
  id: number;
  type: string;
  bounds: { maxlat: number; maxlon: number; minlat: number; minlon: number };
  geometry: Latlon[];
}

const getData = async (map: Map) => {
  const b = map.getBounds();
  b.getSouth();
  const bbox = `${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`;
  // console.log(bbox);
  // console.log(map.getBounds());
  // console.log(map.getBounds().toBBoxString());
  const qstr = `[timeout:5][out:json];
  way["highway"](${bbox}); 
  out ids geom;`;

  const json = await axios.post<OverPassDataType>(
    "https://overpass-api.de/api/interpreter",
    qstr
  );
  // console.log(json.data);
  return json.data;
};

export default getData;
