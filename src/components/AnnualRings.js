import React from "react";
import { TextPath } from "react-konva";

function generateSVGPathCommandsForCircle({ radius, x, y }) {
  const f = 0.552;
  const curveSegment1 = [
    `M0 ${-radius}`,
    `C${f * radius} ${-radius}`,
    `${radius} ${-f * radius}`,
    `${radius} 0`,
  ].join(" ");
  const curveSegment2 = [
    `M${radius} 0`,
    `C${radius} ${f * radius}`,
    `${f * radius} ${radius}`,
    `0 ${radius}`,
  ].join(" ");
  const curveSegment3 = [
    `M0 ${radius}`,
    `C-${f * radius} ${radius}`,
    `${-radius} ${f * radius}`,
    `${-radius} 0`,
  ].join(" ");
  const curveSegment4 = [
    `M${-radius} 0`,
    `C${-radius} ${-f * radius}`,
    `-${f * radius} ${-radius}`,
    `0 ${-radius}`,
  ].join(" ");
  return `${curveSegment1}${curveSegment2}${curveSegment3}${curveSegment4}`;
}

const OUTER_PADDING = 15;

const index = ({
  textLines = [],
  x,
  y,
  outerRadius,
  ringWidth = 50,
  rotationFn = () => 0,
}) => (
  <>
    {textLines.map((text, i) => (
      <TextPath
        key={text + i}
        text={text}
        fill="#333"
        fontSize={16}
        fontFamily="Arial"
        textBaseline="top"
        rotation={rotationFn(i)}
        data={generateSVGPathCommandsForCircle({
          radius: outerRadius - i * ringWidth * 4 - OUTER_PADDING,
          x,
          y,
        })}
        x={0}
        y={0}
      />
    ))}
  </>
);

export default index;
