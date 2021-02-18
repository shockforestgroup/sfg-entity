import React from "react";

import AnnualRings from "./AnnualRings";
import { isDebugMode } from "../helpers/readEnvVar.js";
import settings from "../settings";

function splitTextIntoLines(text) {
  return text.split("\n");
}

export default ({ text, radius, onAnimationHasEnded = () => {} }) => (
  <AnnualRings
    textLines={splitTextIntoLines(text)}
    fontSize={14}
    x={0}
    y={0}
    outerRadius={radius}
    ringWidth={4}
    rotationFn={(_) => 0}
    hasTypeEffect={
      isDebugMode ? settings.ENTITY_HASTYPEEFFECT_DEBUG : true
    }
    typeEffectSpeed={0.01}
    onAllLinesAnimationHasEnded={onAnimationHasEnded}
  />
);
