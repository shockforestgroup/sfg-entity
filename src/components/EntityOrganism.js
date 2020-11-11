import React, { Component } from "react";
import { Shape } from "react-konva";

export default class EntityOrganism extends Component {
  render() {
    const normalizedVertices = this.props.vertices.map((v) => ({
      x: v.x - this.props.x,
      y: v.y - this.props.y,
    }));
    return (
      <Shape
        id={this.props.id}
        x={this.props.x}
        y={this.props.y}
        sceneFunc={(context, shape) => {
          const startPoint = normalizedVertices[0];
          context.beginPath();
          context.moveTo(startPoint.x, startPoint.y);
          normalizedVertices.forEach((v) => context.lineTo(v.x, v.y));
          context.closePath();
          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
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
