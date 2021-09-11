import React from 'react'

import "./GraphTable.css"
import GraphNode from './GraphNode/GraphNode'

function GraphTable() {

    return (
        <div className="graph-container" id="container">
            <GraphNode/>
        </div>
    )
}

export default GraphTable
