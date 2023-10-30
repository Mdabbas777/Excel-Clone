//Storage ( 2D array )
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// True denotes cyclic.
function isGraphCyclic(graphComponentMatrix) {
  // dependency = visited , dfsVisited ( 2D array )
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = []; // to trace node visited
    let dfsVisitedRow = []; // Stack visited trace
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] == false) {
        let response = dfsCyclicDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        if (response === true) {
          return [i, j];
        }
      }
    }
  }
  return null;
}

// Start = make visited and dfsVisited True.
// End = make dfsVisited False.
// if( vis[i][j] == true ) return as path is visited already.
// Cycle detection condition if( vis[i][j] == true && dfsvis[i][j] == true ) then it is a cycle
function dfsCyclicDetection(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
    if (visited[nbrr][nbrc] === false) {
      let response = dfsCyclicDetection(
        graphComponentMatrix,
        nbrr,
        nbrc,
        visited,
        dfsVisited
      );
      if (response === true) {
        return true; // found cycle return true.
      }
    } else if (
      visited[nbrr][nbrc] === true &&
      dfsVisited[nbrr][nbrc] === true
    ) {
      return true; // found cycle return true.
    }
  }

  dfsVisited[srcr][srcc] = false;
  return false;
}
