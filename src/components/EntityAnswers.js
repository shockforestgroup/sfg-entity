import React from "react";
import AnnualRings from "./AnnualRings";

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
          inverted={true}
          textLines={[text]}
          textColor={isActivated ? "red" : isTriggered ? "green" : "black"}
          x={0}
          y={0}
          outerRadius={radius}
          ringWidth={6}
          rotationFn={(_) => -90 - (i * 180) / options.length}
        />
      );
    })}
  </>
);
export default index;
