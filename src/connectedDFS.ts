import { AdjListType } from "./createAdjList";

const connectedDFS = (Adj: AdjListType, startIndex: number): number[] => {
  const visited: boolean[] = new Array(Adj.vertexes.length).fill(false);
  const connectedIndices: number[] = [];

  const dfs = (index: number) => {
    visited[index] = true;
    connectedIndices.push(index);

    for (const neighbor of Adj.Adj[index])
      if (!visited[neighbor]) dfs(neighbor);
  };
  dfs(startIndex);
  return connectedIndices;
};

export default connectedDFS;
