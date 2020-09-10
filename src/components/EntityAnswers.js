import React from "react";
import AnnualRings from "./AnnualRings";

function splitTextIntoLines(text) {
  return text.split("\n");
}

function calculateRadians(radius) {
  const innerHalfRect = window.innerWidth / 2;
  const length = innerHalfRect / radius;
  if (length > 1) {
    return 180;
  }
  return (Math.asin(length) / 2) * 180;
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
      /* const isActivated = id === currentActivated;
      const isTriggered = id === currentTriggered;*/
      const radians = calculateRadians(radius);
      const offsetForCentering = -180 + radians / 2;
      return (
        <AnnualRings
          key={id}
          ref={(ref) => createRef(id, ref)}
          fontSize={14}
          inverted={true}
          textLines={splitTextIntoLines(text)}
          textColor={"black"}
          x={0}
          y={0}
          outerRadius={radius}
          ringWidth={4}
          rotationFn={(_) =>
            offsetForCentering - (i / (options.length - 1)) * radians
          }
          opacity={0}
        />
      );
    })}
  </>
);
export default index;
