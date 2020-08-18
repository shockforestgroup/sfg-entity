import React from "react";
import { TextPath } from "react-konva";

function generateSVGPathCommandsForCircle({ radius }) {
  const f = 0.552;
  const curveSegment1 = [
    `M0 0`,
    `C${f * radius} 0`,
    `${radius} ${radius - f * radius}`,
    `${radius} ${radius}`,
  ].join(" ");
  const curveSegment2 = [
    `M${radius} ${radius}`,
    `C${radius} ${radius + f * radius}`,
    `${f * radius} ${radius * 2}`,
    `0 ${radius * 2}`,
  ].join(" ");
  const curveSegment3 = [
    `M0 ${radius * 2}`,
    `C-${f * radius} ${radius * 2}`,
    `${-radius} ${radius + f * radius}`,
    `${-radius} ${radius}`,
  ].join(" ");
  const curveSegment4 = [
    `M${-radius} ${radius}`,
    `C${-radius} ${radius - f * radius}`,
    `-${f * radius} 0`,
    `0 0`,
  ].join(" ");
  return `${curveSegment1}${curveSegment2}${curveSegment3}${curveSegment4}`;
}

const index = ({ textLines = [], x, y, outerRadius, ringWidth = 50 }) => (
  <>
    {textLines.map((text, i) => (
      <TextPath
        key={text + i}
        text={text}
        fill="#333"
        fontSize={20}
        fontFamily="Arial"
        rotation={0}
        data={generateSVGPathCommandsForCircle({
          radius: outerRadius - i * ringWidth * 4,
        })}
        x={0}
        y={0}
      />
    ))}
  </>
);

export default index;
