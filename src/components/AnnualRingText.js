import React, { Component } from "react";
import { TextPath, Group } from "react-konva";

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

  changeScale() {
    this.textPath.to({
      scaleX: this.props.scale,
      scaleY: this.props.scale,
      duration: 0.1
    })
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

  componentDidUpdate(prevProps) {
    if (prevProps.scale != this.props.scale) {
      this.changeScale();
    }
  }

  render() {
    const { textColor, inverted, rotation, data, fontSize, scale, offset } = this.props;
    const { text } = this.state;
    return (
      <Group
        rotation={rotation}
        offsetX={-offset.x}
        offsetY={-offset.y}
        >
        <TextPath
          ref={node => {
            this.textPath = node;
          }}
          text={text}
          fill={textColor}
          fontSize={fontSize}
          fontFamily="Inconsolata"
          align="center"
          textBaseline={inverted ? "bottom" : "top"}
          data={data}
          offset={offset}
        />
      </Group>
    );
  }
}

AnnualRingText.defaultProps = {
  animationHasEnded: () => { },
  typeEffectSpeed: 100,
  fontSize: 16,
};
