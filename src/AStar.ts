import { LatLngTuple, circle, Map } from "leaflet";
import { AdjListType } from "./createAdjList";
import drawCircle from "./drawCircle";

interface Node {
  index: number;
  g: number;
  h: number;
  f: number;
  parent?: Node;
}

export const calculateDistance = (
  start: LatLngTuple,
  end: LatLngTuple
): number => {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  return Math.sqrt(dx * dx + dy * dy);
};

const AStar = (
  map: Map,
  Adj: AdjListType,
  startInd: number,
  finishInd: number
): number[] => {
  // Create arrays for open and closed sets
  const openSet: Node[] = [];
  const closedSet: Node[] = [];

  // Create the start and finish nodes
  const startNode: Node = { index: startInd, g: 0, h: 0, f: 0 };
  const finishNode: Node = { index: finishInd, g: 0, h: 0, f: 0 };

  // Add the start node to the open set
  openSet.push(startNode);

  // A* algorithm
  while (openSet.length > 0) {
    // Find the node with the lowest f value in the open set
    const currentNode = openSet.reduce((minNode, node) =>
      node.f < minNode.f ? node : minNode
    );

    // Remove the current node from the open set
    openSet.splice(openSet.indexOf(currentNode), 1);

    // Add the current node to the closed set
    closedSet.push(currentNode);

    // If we have reached the finish node, reconstruct the path and return it
    if (currentNode.index === finishInd) {
      const path: number[] = [];
      let current = currentNode;
      while (current) {
        path.unshift(current.index);
        current = current.parent!;
      }
      return path;
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
          openSet.push({
            index: neighborIndex,
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
  }
  // If no path is found, return an empty array
  return [];
};

export default AStar;
