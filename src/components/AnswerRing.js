import React from "react";
import AnnualRings from "./AnnualRings";

const index = React.forwardRef(
  (
    { textLines, radius, rotationOffset = 0, isTriggered, isActivated },
    ref
  ) => (
    <AnnualRings
      ref={ref}
      inverted={true}
      textLines={textLines}
      textColor={isActivated ? "red" : isTriggered ? "green" : "black"}
      x={0}
      y={0}
      outerRadius={radius}
      ringWidth={6}
      rotationFn={(_) => rotationOffset}
    />
  )
);

export default index;
