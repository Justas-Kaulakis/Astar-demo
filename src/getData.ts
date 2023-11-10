import axios, { AxiosResponse } from "axios";
import { LatLngBounds, Map, latLngBounds } from "leaflet";
export interface OverPassDataType {
  elements: OverPassElementType[];
  generator: string;
  version: number;
  osm3s: object;
}

export type Latlon = { lat: number; lon: number };
export interface OverPassElementType {
  bounds: {
    maxlat: number;
    maxlon: number;
    minlat: number;
    minlon: number;
  };
  geometry: Latlon[];
  id: number;
  nodes: number[];
  tags: { maxspeed?: string; oneway?: string; junction?: string };
  type: string;
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
  const qstr2 = `[timeout:5][out:json];
  way["highway"]["highway"!~"footway|pedestrian|path"](${bbox});
  out body geom;`;

  const json = await axios.post<OverPassDataType>(
    "https://overpass-api.de/api/interpreter",
    qstr2
  );
  // console.log(json.data);
  return json.data;
};

export default getData;
