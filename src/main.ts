import "leaflet/dist/leaflet.css";

import L, { LatLngTuple } from "leaflet";
import { FeatureCollection } from "geojson";
import createAdjList, { AdjListType } from "./createAdjList";
import { LineString, MultiLineString } from "geojson";
import findClosestNodes from "./findClosestNodes";
import { createMarker } from "./ui";
import { AStarAnimate, Poly, polylineFromPath } from "./AStarAnimate";
import getData from "./getData";
import createAdjList2 from "./createAdjList2";
import connectedDFS from "./connectedDFS";
import drawCircle from "./drawCircle";
import drawIslands from "./drawIslands";
import flashbang from "./flashbang";

const zzmCoords: LatLngTuple = [54.682524, 25.280692];
const zoom = 15;
var map = L.map("map").setView(zzmCoords, zoom);

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  noWrap: false,
  maxZoom: 20,
}).addTo(map);

let sPoz = map.containerPointToLatLng(L.point(200, 300));
let ePoz = map.containerPointToLatLng(L.point(600, 300));

const stMarker = createMarker("start", [sPoz.lat, sPoz.lng]).addTo(map);
const finishMarker = createMarker("end", [ePoz.lat, ePoz.lng]).addTo(map);

const loadGraph = async () => {
  const file = "zzm_nodes.geojson";
  const data: FeatureCollection = await fetch(file).then((res) => res.json());
  return createAdjList(data.features);
};

//const Adj = await loadGraph();
export const makePath = (path: number[], Adj: AdjListType) => {
  return L.polyline(
    path.map((d) => Adj.vertexes[d]),
    { color: "var(--rez-color)", weight: 5, className: "rez-bloom" }
  );
};

let pathLine: L.Polyline<LineString | MultiLineString, any> | undefined;
const btn = document.getElementById("find-btn")! as HTMLButtonElement;

let searchPoly: Poly;

btn.addEventListener("click", async (e) => {
  btn.disabled = true;
  if (pathLine) pathLine.removeFrom(map);
  if (searchPoly) searchPoly.removeFrom(map);
  console.log("find the path!");

  const data = await getData(map);
  const Adj = createAdjList2(data.elements);
  //drawIslands(map, Adj);

  // const dfspath = connectedDFS(Adj, 5);
  // console.log("path: ", dfspath);
  // dfspath.forEach((sk) => {
  //   //console.log(Adj.vertexes[sk]);
  //   L.circle(Adj.vertexes[sk], {
  //     radius: 12,
  //     color: "red",
  //   }).addTo(map);
  // });

  const s = findClosestNodes(Adj.vertexes, [
    stMarker.getLatLng().lat,
    stMarker.getLatLng().lng,
  ])[0];
  const f = findClosestNodes(Adj.vertexes, [
    finishMarker.getLatLng().lat,
    finishMarker.getLatLng().lng,
  ])[0];

  const { path, polyline } = await AStarAnimate(0, map, Adj, s, f);
  searchPoly = polyline;
  pathLine = makePath(path, Adj).addTo(map);
  flashbang();

  btn.disabled = false;
});
