import React, { Component } from "react";
import { Group } from "react-konva";
import generateSVGPathCommandsForCircle from "../helpers/generateSVGPathCommandsForCircle";
import AnnualRingText from "./AnnualRingText";

const OUTER_PADDING = 15;

class AnnualRings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: this.props.inverted
        ? this.props.textLines.slice(0).reverse()
        : this.props.textLines,
      lineIndex: 0,
    };
  }

  handleSingleRingAnimationHasEnded() {
    const newLineIndex = this.state.lineIndex + 1;
    this.setState({
      lineIndex: newLineIndex,
    });
    if (newLineIndex >= this.state.lines.length) {
      this.props.animationHasEnded();
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
      animationHasEnded,
    } = this.props;

    return (
      <Group ref={innerRef} opacity={opacity}>
        {this.state.lines.map(
          (text, i) =>
            i <= this.state.lineIndex && (
              <AnnualRingText
                key={text + i}
                text={text}
                textColor={textColor}
                fill={textColor}
                inverted={inverted}
                rotation={rotationFn() + 180}
                data={generateSVGPathCommandsForCircle({
                  radius: outerRadius - i * ringWidth * 4 - OUTER_PADDING,
                  x,
                  y,
                  inverted: inverted,
                })}
                hasTypeEffect={hasTypeEffect}
                animationHasEnded={() => {
                  console.log("ended!");
                  this.handleSingleRingAnimationHasEnded();
                }}
                typeEffectSpeed={typeEffectSpeed}
              />
            )
        )}
      </Group>
    );
  }
}

AnnualRings.defaultProps = {
  textLines: [],
  textColor: "#000",
  ringWidth: 50,
  rotationFn: () => 0,
  hasTypeEffect: false,
  typeEffectSpeed: 100,
  opacity: 1,
  animationHasEnded: () => {},
};

export default React.forwardRef((props, ref) => (
  <AnnualRings innerRef={ref} {...props} />
));
