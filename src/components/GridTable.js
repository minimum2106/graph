import React from 'react'

const COLUMNS = 59;
const ROWS = 15;

const gridTableInit = (rows, cols) => {
    const nodes = [];
    for(let row = 0; row < rows; row++)
    {
        let currentRow = [];
        for(let col = 0; col < cols; col++)
        {
            currentRow.push(col);
        }

        nodes.push(currentRow);
    }

    return nodes;
}


function GridTable() {
    return (
        <div>
            
        </div>
    )
}

export default GridTable
