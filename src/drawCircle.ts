import {
  CircleMarkerOptions,
  LatLngTuple,
  Map,
  circle,
  marker,
  divIcon,
} from "leaflet";

const drawCircle = (
  map: Map,
  vertexes: LatLngTuple[],
  ind: number,
  options?: CircleMarkerOptions
) => {
  circle(vertexes[ind], {
    radius: 12,
    color: "red",
    ...options,
  }).addTo(map);
};

export default drawCircle;
