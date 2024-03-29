import React, { Component } from "react";
import { Group } from "react-konva";
import generateSVGPathCommandsForCircle from "../helpers/generateSVGPathCommandsForCircle";
import AnnualRingText from "./AnnualRingText";

import { isDebugMode } from "../helpers/readEnvVar.js";
import settings from "../settings";

const OUTER_PADDING = 15;

class AnnualRings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineIndex: 0,
    };
  }

  handleSingleLineAnimationHasEnded() {
    const newLineIndex = this.state.lineIndex + 1;
    this.setState({
      ...this.state,
      lineIndex: this.state.lineIndex + 1,
    });
    if (newLineIndex >= this.props.textLines.length) {
      this.props.onAllLinesAnimationHasEnded();
    }
  }

  
  render() {
    const {
      innerRef,
      x,
      y,
      textColor,
      outerRadius,
      ringWidth,
      rotationFn,
      inverted,
      hasTypeEffect,
      typeEffectSpeed,
      opacity,
      fontSize,
      scale,
      textLines,
      offset
    } = this.props;

    const { lineIndex } = this.state;

    const lines = this.props.inverted
      ? textLines.slice(0).reverse()
      : textLines;
    return (
      <Group ref={innerRef} opacity={opacity}>
        {lines.map(
          (text, i) =>
            (i <= lineIndex || !hasTypeEffect) && (
              <AnnualRingText
                key={text}
                text={text}
                textColor={
                  isDebugMode ? settings.ENTITY_TEXT_COLOR_DEBUG : textColor
                }
                fontSize={fontSize}
                scale={scale}
                fill={textColor}
                inverted={inverted}
                rotation={rotationFn() + 180}
                data={generateSVGPathCommandsForCircle({
                  radius: outerRadius - i * ringWidth * 4 - OUTER_PADDING,
                  x,
                  y,
                  inverted: inverted,
                })}
                offset={offset}
                hasTypeEffect={hasTypeEffect}
                animationHasEnded={() => {
                  this.handleSingleLineAnimationHasEnded();
                }}
                typeEffectSpeed={
                  isDebugMode ? settings.ENTITY_TYPEEFFECTSPEED_DEBUG : typeEffectSpeed
                }
              />
            )
        )}
      </Group>
    );
  }
}

AnnualRings.defaultProps = {
  lineIndex: 0,
  textLines: [],
  textColor: settings.ENTITY_TEXT_COLOR,
  fontSize: 16,
  ringWidth: 50,
  rotationFn: () => 0,
  hasTypeEffect: false,
  typeEffectSpeed: settings.ENTITY_TYPEEFFECTSPEED,
  opacity: 1,
  onAllLinesAnimationHasEnded: () => {},
  offset: {
    x: 0,
    y: 0
  }
};

/* Note: The 'key' prop is crucial here to help reset state if props change */
/* See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key */

export default React.forwardRef((props, ref) => (
  <AnnualRings key={props.textLines} innerRef={ref} {...props} />
));
