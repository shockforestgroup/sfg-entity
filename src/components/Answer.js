import React from "react";
import { Text } from "react-konva";

const index = React.forwardRef(
  ({ text, x, y, isTriggered, isActivated }, ref) => (
    <Text
      ref={ref}
      text={text}
      x={x}
      y={y}
      fill={isActivated ? "red" : isTriggered ? "green" : "black"}
      fontSize={20}
    />
  )
);

export default index;
