import React from 'react'
// import { useState, useEffect } from 'react';

import GridNode from './GridNode/GridNode'

import {dijkstra, getNodesInShortestPathOrder} from '../algos/dijkstra';

const COLUMNS = 59;
const ROWS = 15;


const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const gridTableInit = (rows, cols) => {
    const nodes = [];
    for(let row = 0; row < rows; row++)
    {
        let currentRow = [];
        for(let col = 0; col < cols; col++)
        {
            currentRow.push(createNode(row, col));
        }

        nodes.push(currentRow);
    }

    return nodes;
}

const createNode = (row, col) => {
    return {
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
} 

function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }


function visualizeDijkstra(gridTable) {
    console.log('run')
    const startNode = gridTable[START_NODE_ROW][START_NODE_COL];
    const finishNode = gridTable[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(gridTable, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
}




function GridTable() {
    const gridTable = gridTableInit(ROWS, COLUMNS);

//    useEffect(() => {
       
//    })

    return (
        <div>
            {
                gridTable.map((row, rowIndex) => {
                    return(
                        <div key={rowIndex}>
                            {
                                row.map((node, nodeIndex) => 
                                {   
                                    const {isStart, isFinish, col, row, isWall} = node;
                                    return(
                                    <GridNode 
                                        key = {nodeIndex} 
                                        isFinish = {isFinish}
                                        isStart = {isStart}
                                        col = {col}
                                        row = {row}
                                        isWall = {isWall}
                                        ></GridNode>
                                )})
                            }
                        </div>
                    )
                })
            }
            <button onClick={() => visualizeDijkstra(gridTable)}>Dijkstra</button>
        </div>
    )
}

export default GridTable
