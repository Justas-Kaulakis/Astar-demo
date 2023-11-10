import { Feature, Position, Point, LineString } from "geojson";
import L, { LatLngBounds, LatLngTuple, Map } from "leaflet";
import { AdjListType } from "./createAdjList";
import { Latlon, OverPassElementType } from "./getData";

const getIndex2 = (vertexes: LatLngTuple[], p: Latlon) => {
  for (let i = 0; i < vertexes.length; i++)
    if (vertexes[i][0] == p.lat && vertexes[i][1] == p.lon) return i;
  return -1;
};

const createAdjList2 = (elements: OverPassElementType[]): AdjListType => {
  let vertexes: LatLngTuple[] = [];
  let Adj: number[][] = [];
  elements.forEach((el) => {
    //.map((el) => ({ line: el.geometry, oneway: el.tags?.oneway })) //.flat()
    const line = el.geometry,
      oneway = el.tags?.oneway,
      junction = el.tags?.junction;
    const oneDir = oneway == "yes" || junction == "roundabout";
    if (oneDir) console.log("oneway");
    let prevInd = getIndex2(vertexes, line[0]);
    if (prevInd === -1) {
      vertexes.push([line[0].lat, line[0].lon]);
      Adj.push([]);
      prevInd = vertexes.length - 1;
    }
    for (let i = 1; i < line.length; i++) {
      const ind = getIndex2(vertexes, line[i]);
      if (ind < 0) {
        vertexes.push([line[i].lat, line[i].lon]);
        Adj.push([prevInd]);
        //if (oneway === undefined)
        Adj[prevInd].push(Adj.length - 1);
        prevInd = Adj.length - 1;
      } else {
        Adj[prevInd].push(ind);
        if (!oneDir) Adj[ind].push(prevInd);
        prevInd = ind;
      }
    }
  });
  return { vertexes, Adj };
};

export default createAdjList2;
