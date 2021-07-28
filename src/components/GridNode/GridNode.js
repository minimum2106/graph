import React from 'react';

import './GridNode.css';

function GridNode(props) {
    const {isFinish, isStart, isWall,isShortestPath, col, row, setMouseDown, handleMouseDown, handleMouseEntered} = props;

    const extraClassName = isFinish? 'node-finish' : isStart? 'node-start': isWall? 'node-wall': isShortestPath? 'node-shortest-path' : ''

    return (
        <div className= {`node ${extraClassName}`}
            id={`node-${row}-${col}`}
            onMouseDown = {() => handleMouseDown(row, col)}
            onMouseUp = {() => setMouseDown()}
            onMouseEnter = {() => handleMouseEntered(row, col)}
             ></div>
    )
}

export default GridNode
