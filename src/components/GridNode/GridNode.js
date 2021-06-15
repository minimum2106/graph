import React from 'react';

import './GridNode.css';

function GridNode(props) {
    const {isFinish, isStart, isWall, col, row} = props;

    const extraClassName = isFinish? 'node-finish' : isStart? 'node-start': isWall? 'node-wall': ''

    return (
        <div className= {`node ${extraClassName}`}
             id={`node-${row}-${col}`}
             ></div>
    )
}

export default GridNode
