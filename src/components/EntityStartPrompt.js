import React from "react";
import AnnualRings from "./AnnualRings";

const PRE_START_TEXT = "Drag here to start";

const index = ({ radius, createRef }) => (
  <>
    <AnnualRings
      ref={(ref) => createRef(ref)}
      fontSize={14}
      inverted={true}
      textLines={[PRE_START_TEXT]}
      x={0}
      y={0}
      outerRadius={radius - radius / 4}
      rotationFn={(_) => -180}
      opacity={1}
    />
  </>
);
export default index;
