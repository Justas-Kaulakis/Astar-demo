import { LatLngTuple, latLng } from "leaflet";
import { calculateDistance } from "./AStar";

export const pathDistance = (vertexes: LatLngTuple[], path: number[]) => {
  let dist = 0;
  for (let i = 0; i < path.length - 1; i++)
    dist += calculateDistance(vertexes[path[i]], vertexes[path[i + 1]]);
  return dist;
};

export const pathDistanceMeters = (vertexes: LatLngTuple[], path: number[]) => {
  let dist = 0;
  for (let i = 0; i < path.length - 1; i++)
    dist += latLng(vertexes[path[i]]).distanceTo(latLng(vertexes[path[i + 1]]));
  return dist;
};

//export default pathDistance;
