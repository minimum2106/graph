import React from 'react'
import { useState, useEffect } from 'react';

import GridNode from './GridNode/GridNode'

import './GridTable.css';

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
        row, col,
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
        const {row, col} = node
        if((row !== START_NODE_ROW || col !== START_NODE_COL) && (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
      }, 10 * i);
    }
  }

function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const {row, col} = node
        if((row !== START_NODE_ROW || col !== START_NODE_COL) && (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
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
    const [gridTable, setGridTable] = useState(gridTableInit(ROWS, COLUMNS));
    const [isMouseDown, setMouseDown] = useState(false);
    const [buttonState, setButtonState] = useState("")

    useEffect(() => {
        console.log('GRID TABLE CHANGED')
    },[gridTable]);


    function handleMouseEntered(row, col) {
        if (!isMouseDown) return
        console.log(gridTable[row][col].isWall)

        setGridTable(
            gridTable.map(rows => {return rows.map(node =>
                (node.col === col && node.row === row)
                ? {...node, isWall : !node.isWall}
                : node 
        )}))
    }

    
    function handleMouseDown(row, col) {
        console.log('mouse down')
        console.log(row)
        console.log(col)
        if(buttonState === "chooseStartNode") {
            document.getElementById("start_node_btn").className = "start_node_btn node_pressed"
        }


        setMouseDown(true)
    }

    function handleMouseUp() {
        console.log("mouse up")
        setMouseDown(false)
    }

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
                                        handleMouseEntered = {handleMouseEntered}
                                        handleMouseDown ={handleMouseDown}
                                        setMouseDown = {handleMouseUp}
                                        ></GridNode>
                                )})
                            }
                        </div>
                    )
                })
            }
            <button id="run_btn" onClick={() => visualizeDijkstra(gridTable)}>Dijkstra</button>
            <button id="start_node_btn" onClick={() => setButtonState("chooseStartNode")}>choose start node</button>
            <button id="finish_node_btn" onClick={() => setButtonState("chooseFinishNode")}>choose finish node</button>
            <button id="wall_created_btn" onClick={() => setButtonState("createWall")}>create wall</button>
        </div>
    )
}

// create a button to trigger create wall 

export default GridTable
