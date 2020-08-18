import React from "react";
import AnnualRings from "./AnnualRings";

const index = React.forwardRef(({ text, isTriggered, isActivated }, ref) => (
  <AnnualRings
    textLines={[text]}
    x={0}
    y={0}
    outerRadius={400}
    ringWidth={6}
    rotationFn={(_) => -90}
  />
));

export default index;
