import React, { Component } from "react";

import { Path } from "react-konva";

const CELL_SHAPES = [
  "M18 19.5C18 30.2696 12.8513 39 6.50001 39C0.148731 39 0.5 30.2696 0.5 19.5C0.5 8.73045 0.148731 0 6.50001 0C12.8513 0 18 8.73045 18 19.5Z",
  "M20 26.5C20 37.2696 16.2345 39 7.88873 39C-0.456997 39 0.00457863 30.2696 0.00457863 19.5C0.00457863 8.73045 -0.456997 0 7.88873 0C16.2345 0 20 15.7304 20 26.5Z",
  "M16.9991 23.9212C16.9991 31.6801 11.4215 36 6.85798 36C-2.02875 36 0.266203 25.7589 0.266203 18C0.266203 10.2411 -0.507573 0 8.37915 0C17.2659 0 16.9991 16.1623 16.9991 23.9212Z",
];

export default class EntityOrganism extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: CELL_SHAPES[Math.floor(Math.random() * CELL_SHAPES.length)],
    };
  }
  render() {
    return (
      <Path
        id={this.props.id}
        data={this.state.shape}
        x={this.props.x}
        y={this.props.y}
        rotation={this.props.rotation}
        scaleX={this.props.isDragging ? 1 : 1}
        scaleY={this.props.isDragging ? 1 : 1}
        stroke="black"
        strokeWidth={1}
        fill="#fff"
        draggable
        onDragStart={this.props.onDragStart}
        onDragMove={this.props.onDragMove}
        onDragEnd={this.props.onDragEnd}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      />
    );
  }
}
