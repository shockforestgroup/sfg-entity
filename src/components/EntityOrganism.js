import React, { Component } from "react";
import { Circle } from "react-konva";

export default class EntityOrganism extends Component {
  render() {
    return (
      <Circle
        id={this.props.id}
        x={this.props.x}
        y={this.props.y}
        radius={10}
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
