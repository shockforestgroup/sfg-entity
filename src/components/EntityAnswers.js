import React from "react";
import AnnualRings from "./AnnualRings";

function splitTextIntoLines(text) {
  return text.split("\n");
}

const index = ({
  options,
  radius,
  createRef,
  currentActivated,
  currentTriggered,
}) => (
  <>
    {options.map(({ id, text }, i) => {
      const isActivated = id === currentActivated;
      const isTriggered = id === currentTriggered;
      return (
        <AnnualRings
          key={id}
          ref={(ref) => createRef(id, ref)}
          fontSize={14}
          inverted={true}
          textLines={splitTextIntoLines(text)}
          textColor={isActivated ? "red" : isTriggered ? "green" : "black"}
          x={0}
          y={0}
          outerRadius={radius}
          ringWidth={4}
          rotationFn={(_) => -90 - (i / (options.length - 1)) * 180}
          opacity={0}
        />
      );
    })}
  </>
);
export default index;
