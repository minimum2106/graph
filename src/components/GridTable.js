import React from 'react'
import { useState, useEffect } from 'react';

import GridNode from './GridNode/GridNode'

import './GridTable.css';

import { dijkstra, getNodesInShortestPathOrder } from '../algos/dijkstra';

const COLUMNS = 59;
const ROWS = 15;

function GridTable() {
    const [startNodeCol, setStartNodeCol] = useState(15)
    const [startNodeRow, setStartNodeRow] = useState(10)
    const [finishNodeCol, setFinishNodeCol] = useState(35)
    const [finishNodeRow, setFinishNodeRow] = useState(10)

    function clearGrid() {
        if (true) {
          const newGrid = gridTable.slice();
          for (const row of newGrid) {
            for (const node of row) {
              let nodeClassName = document.getElementById(
                `node-${node.row}-${node.col}`,
              ).className;
              if (
                nodeClassName !== 'node node-start' &&
                nodeClassName !== 'node node-finish' &&
                nodeClassName !== 'node node-wall'
              ) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node';
                node.isVisited = false;
                node.distance = Infinity;
                // node.distanceToFinishNode =
                //   Math.abs(this.state.FINISH_NODE_ROW - node.row) +
                //   Math.abs(finishNodeCol - node.col);
              }
              if (nodeClassName === 'node node-finish') {
                node.isVisited = false;
                node.distance = Infinity;
                // node.distanceToFinishNode = 0;
              }
              if (nodeClassName === 'node node-start') {
                node.isVisited = false;
                node.distance = Infinity;
                // node.distanceToFinishNode =
                //   Math.abs(finishNodeRow - node.row) +
                //   Math.abs(finishNodeCol - node.col);
                node.isStart = true;
                node.isWall = false;
                node.previousNode = null;
                node.isNode = true;
              }
            }
          }
        }
      }

    function handleMouseEntered(row, col) {
        if (!isMouseDown) return
        if (buttonState !== "wall") return
        console.log(gridTable[row][col].isWall)

        setGridTable(
            gridTable.map(rows => {
                return rows.map(node =>
                    (node.col === col && node.row === row)
                        ? { ...node, isWall: !node.isWall }
                        : node
                )
            }))
    }

    function handleMouseDown(row, col) {
        console.log('mouse down')
        console.log(row)
        console.log(col)
        if (buttonState === "start") {
            setGridTable(
                gridTable.map(rows => {
                    return rows.map(node => {
                        if (node.col === col && node.row === row) {
                            setStartNodeCol(col)
                            setStartNodeRow(row)

                            return { ...node, isStart: true }
                        }

                        return { ...node, isStart: false }
                    }
                    )
                }))
        }

        if (buttonState === "finish") {
            setGridTable(
                gridTable.map(rows => {
                    return rows.map(node => {
                        if (node.col === col && node.row === row) {
                            setFinishNodeCol(col)
                            setFinishNodeRow(row)

                            return { ...node, isFinish: true }
                        }

                        return { ...node, isFinish: false }
                    }
                    )
                }))
        }

        setMouseDown(true)
    }

    function handleMouseUp() {
        console.log("mouse up")
        setMouseDown(false)
    }


    function handleClickedBtn(btnName) {
        clearGrid()
        setButtonState(btnName)
        console.log(btnName)
        document.getElementById(btnName).className = "btn btn_clicked"
    }

    const gridTableInit = (rows, cols) => {

        const nodes = [];
        for (let row = 0; row < rows; row++) {
            let currentRow = [];
            for (let col = 0; col < cols; col++) {
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
            isShortestPath: false,
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
        console.log("finish visualization")
        console.log(gridTable)
        console.log('end loop')
      }


    function visualizeDijkstra(gridTable) {
        console.log('run')
        console.log(gridTable)
        const startNode = gridTable[startNodeRow][startNodeCol];
        const finishNode = gridTable[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = dijkstra(gridTable, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode, startNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const [gridTable, setGridTable] = useState(gridTableInit(ROWS, COLUMNS));
    const [isMouseDown, setMouseDown] = useState(false);
    const [buttonState, setButtonState] = useState("")

    useEffect(() => {
        console.log('GRID TABLE CHANGED')
    }, [gridTable]);

    // const [nodesInShortestPathOrder, setNodeInShortestPathOrder] = useState([])

    // useEffect(() => {
    //     let i = 0
    //     if(i < nodesInShortestPathOrder.length) {
    //         setInterval(() => {
    //             setGridTable(gridTable.map())
    //         }
    //         )
    //     }
    // }, [nodesInShortestPathOrder])

    return (
        <div>
            {
                gridTable.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex}>
                            {
                                row.map((node, nodeIndex) => {
                                    const { isStart, isFinish, col, row, isWall, isShortestPath, isVisited } = node;
                                    return (
                                        <GridNode
                                            key={nodeIndex}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isVisited={isVisited}
                                            col={col}
                                            row={row}
                                            isWall={isWall}
                                            isShortestPath={isShortestPath}
                                            handleMouseEntered={handleMouseEntered}
                                            handleMouseDown={handleMouseDown}
                                            setMouseDown={handleMouseUp}
                                        ></GridNode>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <button id="run_btn" className="btn" onClick={() => visualizeDijkstra(gridTable)}>Dijkstra</button>
            <button id="start" className="btn" onClick={() => handleClickedBtn("start")}>choose start node</button>
            <button id="finish" className="btn" onClick={() => handleClickedBtn("finish")}>choose finish node</button>
            <button id="wall" className="btn" onClick={() => handleClickedBtn("wall")}>create wall</button>
            <button id="clear" className="btn" onClick={() => clearGrid()}>clear</button>
        </div>
    )
}

// create a button to trigger create wall 

export default GridTable
