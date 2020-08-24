import React, { Component } from "react";
import { TextPath } from "react-konva";

export default class AnnualRingText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tick: 0,
      text: this.props.hasTypeEffect ? "" : this.props.text,
    };
  }

  updateText() {
    const tick = this.state.tick + 1;
    if (tick >= this.props.text.length) {
      clearInterval(this.intervalID);
      this.props.animationHasEnded();
    }
    this.setState({
      text: this.props.text.split("").slice(0, tick).join(""),
      tick: tick,
    });
  }

  componentDidMount() {
    if (this.props.hasTypeEffect) {
      this.intervalID = setInterval(() => {
        this.updateText();
      }, 1 / this.props.typeEffectSpeed);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    this.intervalID = null;
  }

  render() {
    const { textColor, inverted, rotation, data } = this.props;
    const { text } = this.state;
    return (
      <TextPath
        text={text}
        fill={textColor}
        fontSize={16}
        fontFamily="Arial"
        align="center"
        textBaseline={inverted ? "bottom" : "top"}
        rotation={rotation}
        data={data}
        x={0}
        y={0}
      />
    );
  }
}

AnnualRingText.defaultProps = {
  animationHasEnded: () => {},
  typeEffectSpeed: 100,
};
