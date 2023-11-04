import { Map, circle, LatLngTuple, polyline, Polyline } from "leaflet";
import { AdjListType } from "./createAdjList";
import { calculateDistance } from "./AStar";
import { LineString, MultiLineString } from "geojson";

interface Node {
  index: number;
  g: number;
  h: number;
  f: number;
  dist: number;
  parent: Node | null;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export type Poly = Polyline<LineString | MultiLineString, any>;

export const AStarAnimate = async (
  delay: number,
  map: Map,
  Adj: AdjListType,
  startInd: number,
  finishInd: number
): Promise<{ path: number[]; polyline: Poly }> => {
  // Create arrays for open and closed sets
  const openSet: Node[] = [];
  const closedSet: Node[] = [];

  // Create the start and finish nodes
  const startNode: Node = {
    index: startInd,
    dist: 0,
    g: 0,
    h: 0,
    f: 0,
    parent: null,
  };
  // Add the start node to the open set
  openSet.push(startNode);

  // A* algorithm
  const exploredPath: number[] = [];
  let poly: Poly = polyline([]);
  let maxDist = 0;
  const path: number[] = [];
  while (openSet.length > 0) {
    const currentNode = openSet.reduce((minNode, node) =>
      node.f < minNode.f ? node : minNode
    );
    openSet.splice(openSet.indexOf(currentNode), 1);
    closedSet.push(currentNode);

    // Add the current node index to the explored path
    exploredPath.push(currentNode.index);

    poly.removeFrom(map);
    const coords = polylineFromPath(exploredPath, Adj);
    poly = polyline(coords, {
      color: "var(--trail-color)",
      opacity: 0.8,
      className: "trail-bloom",
    }).addTo(map);

    // If we have reached the finish node, reconstruct the path and return it
    if (currentNode.index === finishInd) {
      let current = currentNode;
      while (current) {
        path.unshift(current.index);
        current = current.parent!;
      }

      return { path, polyline: poly };
    }

    // Get the neighbors of the current node
    const neighbors = Adj.Adj[currentNode.index];

    for (const neighborIndex of neighbors) {
      // Skip neighbors in the closed set
      if (closedSet.some((node) => node.index === neighborIndex)) {
        continue;
      }

      // Calculate tentative g value
      const gValue =
        currentNode.g +
        calculateDistance(
          Adj.vertexes[currentNode.index],
          Adj.vertexes[neighborIndex]
        );

      // Check if neighbor is not in the open set or has a lower g value
      const neighborNode = openSet.find((node) => node.index === neighborIndex);
      if (!neighborNode || gValue < neighborNode.g) {
        if (!neighborNode) {
          maxDist = Math.max(currentNode.dist + 1, maxDist);
          openSet.push({
            index: neighborIndex,
            dist: currentNode.dist + 1,
            g: gValue,
            h: calculateDistance(
              Adj.vertexes[neighborIndex],
              Adj.vertexes[finishInd]
            ),
            f:
              gValue +
              calculateDistance(
                Adj.vertexes[neighborIndex],
                Adj.vertexes[finishInd]
              ),
            parent: currentNode,
          });
        } else {
          neighborNode.g = gValue;
          neighborNode.f = gValue + neighborNode.h;
          neighborNode.parent = currentNode;
        }
      }
    }
    await sleep(delay);
  }
  // If no path is found, return an empty array
  return { path: [], polyline: poly };
};

export const polylineFromPath = (path: number[], Adj: AdjListType) => {
  //console.log("drawing!");
  const visited = new Set<number>();
  let polyCoords: LatLngTuple[][] = [];

  const dfs = (vertexIndex: number) => {
    visited.add(vertexIndex);

    for (const targetIndex of Adj.Adj[vertexIndex]) {
      if (
        !visited.has(targetIndex) &&
        path.find((i) => i == targetIndex) !== undefined
      ) {
        polyCoords.push([Adj.vertexes[vertexIndex], Adj.vertexes[targetIndex]]);
        dfs(targetIndex);
      }
    }
  };
  dfs(path[0]);
  return polyCoords;
};
