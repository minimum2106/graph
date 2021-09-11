import React from 'react'

import { useState } from 'react';

import './GraphNode.css'


function GraphNode() {
    // let orgX = 0, orgY= 0, newX = 0, newY = 0;

    const [isDragging, setDragging] = useState(false)
    const [diffX, setDiffX] = useState(0)
    const [diffY, setDiffY] = useState(0)
    const [styles, setStyles] = useState({})



    function moveEnd(e) {
        e.preventDefault()
        setDragging(false)
        console.log("mouse up")
    }
    
    function moveStart(e) {
        e.preventDefault();
        setDragging(true)
        setDiffX(e.screenX - e.currentTarget.getBoundingClientRect().left)
        setDiffY(e.screenY - e.currentTarget.getBoundingClientRect().top)
    }
    
    function elementDrag(e) {
        e.preventDefault();
        if (isDragging) {

            let parent = document.getElementById("container")
            let parentRect = parent.getBoundingClientRect()
    
            const {right, top, left, bottom} = parentRect
    

            if( (e.clientX >= left && (e.clientX < right)) &&
                (e.clientY >= top && (e.clientY < bottom))){

                let newLeft = e.screenX - diffX;
                let newTop = e.screenY - diffY;

                setStyles({
                    left : newLeft,
                    top : newTop
                })
          
            }  else if (e.clientX >= right ) {
                let newLeft = right - e.currentTarget.getBoundingClientRect().width
                setStyles({...styles, left : newLeft})
            } else if (e.clientX <= top ) {
                let newTop = top - e.currentTarget.getBoundingClientRect().height
                setStyles({...styles, top : newTop})
            }else if (e.clientX >= bottom ) {
                let newTop = bottom + e.currentTarget.getBoundingClientRect().height
                setStyles({...styles, top : newTop})
            }else if (e.clientX <= left ) {
                let newLeft = left + e.currentTarget.getBoundingClientRect().width
                setStyles({...styles, left : newLeft})
            }
        }
    }
   
    return (
        <div id="1" 
            className="graph-node" 
            onMouseDown = {(e) => moveStart(e)}
            onMouseMove={(e) => elementDrag(e)}
            onMouseUp={(e) => moveEnd(e)}
            style={styles}
           >
        
        </div>
    )
}

export default GraphNode;





