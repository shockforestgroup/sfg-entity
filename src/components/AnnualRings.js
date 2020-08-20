import React from "react";
import { TextPath, Group } from "react-konva";
import generateSVGPathCommandsForCircle from "../helpers/generateSVGPathCommandsForCircle";

const OUTER_PADDING = 15;

const index = React.forwardRef(
  (
    {
      textLines = [],
      x,
      y,
      textColor = "black",
      outerRadius,
      ringWidth = 50,
      rotationFn = () => 0,
      inverted,
    },
    ref
  ) => {
    const lines = inverted ? textLines.slice(0).reverse() : textLines;
    return (
      <Group ref={ref}>
        {lines.map((text, i) => (
          <TextPath
            key={text + i}
            text={text}
            fill={textColor}
            fontSize={16}
            fontFamily="Arial"
            textBaseline={inverted ? "bottom" : "top"}
            rotation={rotationFn(i)}
            data={generateSVGPathCommandsForCircle({
              radius: outerRadius - i * ringWidth * 4 - OUTER_PADDING,
              x,
              y,
              inverted: inverted,
            })}
            x={0}
            y={0}
          />
        ))}
      </Group>
    );
  }
);

export default index;
