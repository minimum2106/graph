import React from 'react'
import { useState, useEffect } from 'react';

import GridNode from './GridNode/GridNode'

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


function GridTable() {
    const [gridTable, setGridTable] = useState(gridTableInit(ROWS, COLUMNS));

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
        </div>
    )
}

export default GridTable
