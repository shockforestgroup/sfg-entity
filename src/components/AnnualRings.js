import React from "react";
import { Group } from "react-konva";
import generateSVGPathCommandsForCircle from "../helpers/generateSVGPathCommandsForCircle";

import AnnualRingText from "./AnnualRingText";

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
      hasTypeEffect = false,
    },
    ref
  ) => {
    const lines = inverted ? textLines.slice(0).reverse() : textLines;
    return (
      <Group ref={ref}>
        {lines.map((text, i) => (
          <AnnualRingText
            key={text + i}
            text={text}
            textColor={textColor}
            fill={textColor}
            inverted={inverted}
            rotation={rotationFn() + 180}
            data={generateSVGPathCommandsForCircle({
              radius: outerRadius - i * ringWidth * 4 - OUTER_PADDING,
              x,
              y,
              inverted: inverted,
            })}
            hasTypeEffect={hasTypeEffect}
            animationHasEnded={() => {
              console.log("ended!");
            }}
          />
        ))}
      </Group>
    );
  }
);

export default index;
