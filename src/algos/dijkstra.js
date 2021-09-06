// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = grid.reduce((stored, row) => stored.concat(row));

    while (!!unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();

      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;

      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }


  }

  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  

  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  function getNodesInShortestPathOrder(finishNode, startNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null && currentNode !== startNode) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
  
    return nodesInShortestPathOrder;
  }

  function animateDijkstra(startNode, finishNode, visitedNodesInOrder, nodesInShortestPathOrder) {
    const {startNodeCol, startNodeRow} = startNode 
    const {finishNodeCol, finishNodeRow} = finishNode
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(startNode, finishNode, nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const {row, col} = node
        if((row !== startNodeRow || col !== startNodeCol) && (row !== finishNodeRow || col !== finishNodeCol)) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
      }, 10 * i);
    }
  }

function animateShortestPath(startNode, finishNode, nodesInShortestPathOrder) {
  const {startNodeCol, startNodeRow} = startNode 
  const {finishNodeCol, finishNodeRow} = finishNode

  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        // console.log(nodesInShortestPathOrder)
        setTimeout(() => {
            const nodeChanged = nodesInShortestPathOrder[i];
            const {row, col} = nodeChanged
        
            if((row !== startNodeRow || col !== startNodeCol) && (row !== finishNodeRow || col !== finishNodeCol)) {
                document.getElementById(`node-${row}-${col}`).className = 'node node-shortest-path';
            }
        }, 100 * i);
    //   console.log(gridTable)
    }
  }


export function visualizeDijkstra(start, finish, gridTable) {
    const {startNodeCol, startNodeRow} = start
    const {finishNodeCol, finishNodeRow} = finish

    const startNode = gridTable[startNodeRow][startNodeCol];
    const finishNode = gridTable[finishNodeRow][finishNodeCol];

    const visitedNodesInOrder = dijkstra(gridTable, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode, startNode);
    animateDijkstra(start, finish, visitedNodesInOrder, nodesInShortestPathOrder);
}