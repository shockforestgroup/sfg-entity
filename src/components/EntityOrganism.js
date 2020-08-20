import React from "react";

import { Path } from "react-konva";

const index = ({
  id,
  x,
  y,
  shapeData,
  rotation,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Path
    id={id}
    data={shapeData}
    x={x}
    y={y}
    rotation={rotation}
    scaleX={isDragging ? 1.05 : 1}
    scaleY={isDragging ? 1.05 : 1}
    stroke="black"
    strokeWidth={1}
    fill="#fff"
    draggable
    onDragStart={onDragStart}
    onDragMove={onDragMove}
    onDragEnd={onDragEnd}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  />
);

export default index;
