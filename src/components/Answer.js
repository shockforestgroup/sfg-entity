import React from "react";
import { Text } from "react-konva";

const index = React.forwardRef(
  ({ id, text, x, y, isTriggered, isActivated }, ref) => (
    <Text
      key={id}
      ref={ref}
      text={text}
      x={x}
      y={y}
      fill={isActivated ? "red" : isTriggered ? "green" : "black"}
    />
  )
);

export default index;
