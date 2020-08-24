import React from "react";

import AnnualRings from "./AnnualRings";

function splitTextIntoLines(text) {
  return text.split("\\n");
}

export default ({ text, radius }) => (
  <AnnualRings
    textLines={splitTextIntoLines(text)}
    x={0}
    y={0}
    outerRadius={radius}
    ringWidth={6}
    rotationFn={(_) => 0}
    hasTypeEffect={true}
    typeEffectSpeed={0.01}
  />
);
