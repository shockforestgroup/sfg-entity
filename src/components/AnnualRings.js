import React from "react";
import { TextPath } from "react-konva";

function generateSVGPathCommandsForCircle({ radius }) {
  const f = 0.552;
  const curveSegment1 = [
    `M0 0`,
    `C${f * 100} 0`,
    `100 ${100 - f * 100}`,
    `100 100`,
  ].join(" ");
  const curveSegment2 = [
    `M100 100`,
    `C100 ${100 + f * 100}`,
    `${f * 100} 200`,
    `0 200`,
  ].join(" ");
  const curveSegment3 = [
    `M0 200`,
    `C-${f * 100} 200`,
    `-100 ${100 + f * 100}`,
    `-100 100`,
  ].join(" ");
  const curveSegment4 = [
    `M-100 100`,
    `C-100 ${100 - f * 100}`,
    `-${f * 100} 0`,
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
          radius: outerRadius - i * ringWidth,
        })}
        x={x}
        y={y}
      />
    ))}
  </>
);

export default index;
