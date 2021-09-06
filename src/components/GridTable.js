import React from 'react'
import { useState } from 'react';

import GridNode from './GridNode/GridNode'

import './GridTable.css';

import {visualizeDijkstra} from '../algos/dijkstra';


const COLUMNS = 59;
const ROWS = 15;


const gridTableInit = (startNode, finishNode, rows, cols) => {
    const nodes = [];
    for (let row = 0; row < rows; row++) {
        let currentRow = [];
        for (let col = 0; col < cols; col++) {
            currentRow.push(createNode(startNode, finishNode, row, col));
        }

        nodes.push(currentRow);
    }

    return nodes;
}

const createNode = (startNode, finishNode,row, col) => {
    const {startNodeCol, startNodeRow} = startNode
    const {finishNodeCol, finishNodeRow} = finishNode
    
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

function GridTable() {
    const [startNodeCol, setStartNodeCol] = useState(15)
    const [startNodeRow, setStartNodeRow] = useState(10)
    const [finishNodeCol, setFinishNodeCol] = useState(35)
    const [finishNodeRow, setFinishNodeRow] = useState(10)
    const [isMouseDown, setMouseDown] = useState(false);
    const [buttonState, setButtonState] = useState("")
    // const [isRunning, setIsRunning] = useState(false)

    const [gridTable, setGridTable] = useState(gridTableInit({startNodeCol, startNodeRow}, {finishNodeCol, finishNodeRow}, ROWS, COLUMNS));


    function clearWall() {
        setGridTable(gridTable.map((rows) => {
            return rows.map((node) => {
                const newNode = (node.isWall === true)? {...node, isWall : false} : {...node}
                return newNode
            })
        }))
    }


    function clearGrid() {
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
                        return {...node, isVisited : false, distance: Infinity, previousNode : null}
                    })
                }))
            }
        }
      }

    function handleMouseEntered(row, col) {
        if (!isMouseDown) return
        if (buttonState !== "wall") return

        console.log("get in")

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
        setMouseDown(true)
        switch (buttonState) {
            case "start" :
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

                break;

            case "finish" :
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

                break;

            default:
                return;
        }
    }

    function handleClickedBtn(btnName) {
        return function() {
            clearGrid()
            if(buttonState){
                document.getElementById(buttonState).className = "btn"   
            }
            
            setButtonState(btnName)
            document.getElementById(btnName).className = "btn btn_clicked"
        }
    }

    const handleStartBtn = handleClickedBtn("start")
    const handleWallBtn = handleClickedBtn("wall")
    const handleFinishBtn = handleClickedBtn("finish ")

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
                                            setMouseDown={setMouseDown}
                                        ></GridNode>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <button id="run_btn" className="btn" onClick={() => {
                clearGrid()
                visualizeDijkstra({startNodeCol, startNodeRow},{finishNodeCol, finishNodeRow},gridTable)
                }
            }>Dijkstra</button>
            <button id="start" className="btn" onClick={() => handleStartBtn()}>choose start node</button>
            <button id="finish" className="btn" onClick={() => handleFinishBtn()}>choose finish node</button>
            <button id="wall" className="btn" onClick={() => handleWallBtn()}>create wall</button>
            <button id="clear" className="btn" onClick={() => clearGrid()}>clear</button>
            <button id="clear-wall" className="btn" onClick={() => clearWall()}>clear wall</button>
        </div>
    )
}

// create a button to trigger create wall 

// refractor your code after knowing about the immutability of a program also deep clone

export default GridTable
