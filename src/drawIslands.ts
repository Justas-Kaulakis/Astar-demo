import { Map, polyline } from "leaflet";
import { AdjListType } from "./createAdjList";
import connectedDFS from "./connectedDFS";

const drawIslands = (map: Map, Adj: AdjListType) => {
  const drawnIslands: number[] = [];

  // Iterate through all nodes
  for (let i = 0; i < Adj.vertexes.length; i++) {
    if (!drawnIslands.includes(i)) {
      // Find all connected nodes in the current island
      const connectedIndices = connectedDFS(Adj, i);

      if (connectedIndices.length > 1) {
        // If there are at least two connected nodes, draw lines between them
        const islandCoordinates = connectedIndices.map(
          (index) => Adj.vertexes[index]
        );
        polyline(islandCoordinates, { color: "darkblue" }).addTo(map);
      }

      // Mark the connected nodes as drawn to avoid redrawing them
      drawnIslands.push(...connectedIndices);
    }
  }
};

export default drawIslands;
