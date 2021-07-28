import React from 'react'
import { useState, useEffect } from 'react';

import GridNode from './GridNode/GridNode'

import './GridTable.css';

import {dijkstra, getNodesInShortestPathOrder} from '../algos/dijkstra';

const COLUMNS = 59;
const ROWS = 15;

function GridTable() {
    const [startNodeCol, setStartNodeCol] = useState(15)
    const [startNodeRow, setStartNodeRow] = useState(10)
    const [finishNodeCol, setFinishNodeCol] = useState(35)
    const [finishNodeRow, setFinishNodeRow] = useState(10)

    function handleMouseEntered(row, col) {
        if (!isMouseDown) return
        if (buttonState !== "wall") return
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
        if(buttonState === "start") {
            setGridTable(
                gridTable.map(rows => {
                    return rows.map(node => {
                        if(node.col === col && node.row === row) {
                            setStartNodeCol(col)
                            setStartNodeRow(row)
                            
                            return {...node, isStart : true}
                        }

                        return {...node, isStart : false}
                }
            )}))
        }

        if(buttonState === "finish") {
            setGridTable(
                gridTable.map(rows => {
                    return rows.map(node => {
                        if(node.col === col && node.row === row) {
                            setFinishNodeCol(col)
                            setFinishNodeRow(row)
                            
                            return {...node, isFinish : true}
                        }

                        return {...node, isFinish : false}
                }
            )}))
        }

        setMouseDown(true)
    }

    function handleMouseUp() {
        console.log("mouse up")
        setMouseDown(false)
    }


    function handleClickedBtn(btnName) {
        setButtonState(btnName)
        console.log(btnName)
        document.getElementById(btnName).className = "btn btn_clicked"    
    }

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
            isStart: row === startNodeRow && col === startNodeCol,
            isFinish: row === finishNodeRow && col === finishNodeCol,
            distance: Infinity,
            isVisited: false,
            isShortestPath : false,
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
            if((row !== startNodeRow || col !== startNodeCol) && (row !== finishNodeRow || col !== finishNodeCol)) {
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }
          }, 10 * i);
        }
      }
    
    function animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const nodeChanged = nodesInShortestPathOrder[i];
            const {row, col} = nodeChanged
          
            setGridTable( gridTable.map(rows => {
                return rows.map(node => {
                    if (node.col === col && node.row === row 
                    && (row !== startNodeRow || col !== startNodeCol) 
                    && (row !== finishNodeRow || col !== finishNodeCol))
                    {
                        console.log(gridTable)
                        return {...node, isShortestPath : true}
                    }
                    console.log(gridTable)
                    return node
                }
            )}))
          }, 100 * i);
        //   console.log(gridTable)

        // if((row !== START_NODE_ROW || col !== START_NODE_COL) && (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)) {
        //     document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        // }
        }
        console.log('end loop')
      }
    
    
    function visualizeDijkstra(gridTable) {
        console.log('run')
        const startNode = gridTable[startNodeRow][startNodeCol];
        const finishNode = gridTable[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = dijkstra(gridTable, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const [gridTable, setGridTable] = useState(gridTableInit(ROWS, COLUMNS));
    const [isMouseDown, setMouseDown] = useState(false);
    const [buttonState, setButtonState] = useState("")

    useEffect(() => {
        console.log('GRID TABLE CHANGED')
    },[gridTable]);
    
    return (
        <div>
            {
                gridTable.map((row, rowIndex) => {
                    return(
                        <div key={rowIndex}>
                            {
                                row.map((node, nodeIndex) => 
                                {   
                                    const {isStart, isFinish, col, row, isWall, isShortestPath} = node;
                                    return(
                                    <GridNode 
                                        key = {nodeIndex} 
                                        isFinish = {isFinish}
                                        isStart = {isStart}
                                        col = {col}
                                        row = {row}
                                        isWall = {isWall}
                                        isShortestPath = {isShortestPath}
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
            <button id="run_btn" className= "btn" onClick={() => visualizeDijkstra(gridTable)}>Dijkstra</button>
            <button id="start" className= "btn" onClick={() => handleClickedBtn("start")}>choose start node</button>
            <button id="finish" className= "btn" onClick={() => handleClickedBtn("finish")}>choose finish node</button>
            <button id="wall" className= "btn" onClick={() => handleClickedBtn("wall")}>create wall</button>
            <button id="clear" onClick = {() => setGridTable(gridTableInit(ROWS, COLUMNS))}>clear</button>
        </div>
    )
}

// create a button to trigger create wall 

export default GridTable
