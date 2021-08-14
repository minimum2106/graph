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
    const [isMouseDown, setMouseDown] = useState(false);
    const [buttonState, setButtonState] = useState("")

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
            isWall: false,
            previousNode: null,
        };
    }

    const [gridTable, setGridTable] = useState(gridTableInit(ROWS, COLUMNS));

    function clearWall() {
        setGridTable(gridTable.map((rows) => {
            return rows.map((node) => {
                const newNode = (node.isWall === true)? {...node, isWall : false} : {...node}
                return newNode
            })
        }))
    }


    function clearGrid() {
        if (true) {
          const newGrid = gridTable.slice();
          for (const row of newGrid) {
            for (const node of row) {
              let nodeClassName = document.getElementById(`node-${node.row}-${node.col}`,).className;
              if (
                nodeClassName !== 'node node-start' &&
                nodeClassName !== 'node node-finish' &&
                nodeClassName !== 'node node-wall'
              ) {
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
              }

              setGridTable(gridTable.map(rows => {
                  return rows.map(node => {
                      return {...node, isVisited : false, distance: Infinity, previousNode : null, isWall: false}
                  })
              }))
            }
          }
        }
        console.log(gridTable)
      }

    function handleMouseEntered(row, col) {
        if (!isMouseDown) return
        if (buttonState !== "wall") return
        console.log(gridTable[row][col].isWall)

        setGridTable(
            gridTable.map(rows => {
                return rows.map(node =>
                    (node.col === col && node.row === row)
                        ? { ...node, isWall: true }
                        : node
                )
            }))
    }

    function handleMouseDown(row, col) {
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
        setMouseDown(false)
    }


    function handleClickedBtn(btnName) {
        clearGrid()
        if(buttonState){
            document.getElementById(buttonState).className = "btn"   
        }

        setButtonState(btnName)
        document.getElementById(btnName).className = "btn btn_clicked"
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
        console.log("after get visited nodes in order")
        console.log(gridTable)
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode, startNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    useEffect(() => {

    }, [gridTable])

    
    useEffect(() => {
        console.log(gridTable)
    })

    return (
        <div>
            {
                gridTable.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex}>
                            {
                                row.map((node, nodeIndex) => {
                                    const { isStart, isFinish, col, row, isWall } = node;
                                    return (
                                        <GridNode
                                            key={nodeIndex}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            col={col}
                                            row={row}
                                            isWall={isWall}
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
            <button id="clear-wall" className="btn" onClick={() => clearWall()}>clear wall</button>
        </div>
    )
}

// create a button to trigger create wall 

export default GridTable
