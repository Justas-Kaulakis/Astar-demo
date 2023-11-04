import { Feature, Position, Point, LineString } from "geojson";
import L, { LatLngBounds, LatLngTuple, Map } from "leaflet";

export const getIndex = (vertexes: LatLngTuple[], p: L.LatLngTuple) => {
  for (let i = 0; i < vertexes.length; i++)
    if (vertexes[i][0] == p[0] && vertexes[i][1] == p[1]) return i;
  return -1;
};

export interface AdjListType {
  vertexes: LatLngTuple[];
  Adj: number[][];
}

const createAdjList = (features: Feature[]): AdjListType => {
  let vertexes: LatLngTuple[] = [];
  let Adj: number[][] = [];
  features
    .filter(({ geometry }) => geometry.type === "LineString")
    .forEach(({ geometry: p }) => {
      const line = (p as LineString).coordinates;
      line.forEach((d) => d.reverse());
      let prevInd = getIndex(vertexes, line[0] as any);
      if (prevInd === -1) {
        vertexes.push(line[0] as L.LatLngTuple);
        Adj.push([]);
        prevInd = vertexes.length - 1;
      }
      for (let i = 1; i < line.length; i++) {
        const ind = getIndex(vertexes, line[i] as L.LatLngTuple);
        if (ind < 0) {
          vertexes.push(line[i] as any);
          Adj.push([prevInd]);
          Adj[prevInd].push(Adj.length - 1);
          prevInd = Adj.length - 1;
        } else {
          Adj[prevInd].push(ind);
          Adj[ind].push(prevInd);
          prevInd = ind;
        }
      }
    });
  return { vertexes, Adj };
};

export default createAdjList;
