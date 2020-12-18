import React, { Component } from "react";
import { Shape, Circle } from "react-konva";
import { isDebugMode } from "../helpers/readEnvVar.js";

const HALO_RADIUS = 70;

export default class EntityOrganism extends Component {
  render() {
    const normalizedVertices = this.props.vertices.map((v) => ({
      x: v.x - this.props.x,
      y: v.y - this.props.y,
    }));
    return (
      <>
        {this.props.hasHalo && (
          <Circle
            id={this.props.id}
            x={this.props.x}
            y={this.props.y}
            radius={HALO_RADIUS}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndRadius={HALO_RADIUS}
            fillRadialGradientColorStops={[
              0,
              "rgba(255,255,255,0.5)",
              0.7,
              "rgba(150,255,0,0.1)",
              1,
              "rgba(0,0,0,0)",
            ]}
            stroke={null}
            strokeWidth={0}
          />
        )}

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
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          stroke={isDebugMode ? "black" : "white"}
          strokeWidth={1}
        />
      </>
    );
  }
}
