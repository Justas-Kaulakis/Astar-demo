import { LatLngTuple } from "leaflet";
import { calculateDistance } from "./AStar";

const findClosestNodes = (
  vertexes: LatLngTuple[],
  point: LatLngTuple,
  count: number = 1
) => {
  const distances: { index: number; distance: number }[] = [];

  for (let i = 0; i < vertexes.length; i++) {
    const distance = calculateDistance(point, vertexes[i]);
    distances.push({ index: i, distance });
  }

  // Sort nodes by distance
  return distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((entry) => entry.index);
};

export default findClosestNodes;
