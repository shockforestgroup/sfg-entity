import React from "react";
import { render } from "react-dom";
import { Stage, Layer, Text, Circle, Line } from "react-konva";

import Answer from "./components/Answer";

const ANSWERS = [
  { id: "yes", text: "Yes" },
  { id: "no", text: "No" },
  { id: "maybe", text: "Maybe" },
];

function haveIntersection(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: (Math.random() * window.innerWidth) / 7 + (3 * window.innerWidth) / 7,
    y: (Math.random() * window.innerHeight) / 7 + (3 * window.innerHeight) / 7,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = { circles: generateShapes() };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circles: INITIAL_STATE.circles,
      traceLines: {},
      cursorType: "default",
      isTouching: "yes",
      isLanded: "no",
    };
  }

  answerRefs = {};

  handleDragHover = (e) => {
    console.log(this.answerRefs);
    Object.keys(this.answerRefs).forEach((id) => {
      const ref = this.answerRefs[id];
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        this.setState({ isTouching: id });
      } else {
        this.setState({ isTouching: null });
      }
    });
  };

  handleDropLanding = (e) => {
    console.log(this.answerRefs);
    Object.keys(this.answerRefs).forEach((id) => {
      const ref = this.answerRefs[id];
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        this.setState({ isLanded: id });
      }
    });
  };

  updateDragLine = (id, point) => {
    /* append to existing trace line points for this element */
    const elementTraceLinePoints = [
      ...(this.state.traceLines[id] || []),
      point.x,
      point.y,
    ];
    this.setState({
      traceLines: { ...this.state.traceLines, [id]: elementTraceLinePoints },
    });
  };

  handleDragStart = (e) => {
    const id = e.target.id();
    this.setState({
      circles: this.state.circles.map((circle) => {
        return {
          ...circle,
          isDragging: circle.id === id,
        };
      }),
    });

    this.updateDragLine(e.target.id(), {
      x: e.target.attrs.x,
      y: e.target.attrs.y,
    });
    this.setState({ cursorType: "grabbing" });
  };

  handleDragMove = (e) => {
    this.handleDragHover(e);
    this.updateDragLine(e.target.id(), {
      x: e.target.attrs.x,
      y: e.target.attrs.y,
    });
  };

  handleDragEnd = (e) => {
    this.handleDropLanding(e);
    this.setState({
      circles: this.state.circles.map((circle) => {
        return {
          ...circle,
          isDragging: false,
        };
      }),
    });
    this.updateDragLine(e.target.id(), {
      x: e.target.attrs.x,
      y: e.target.attrs.y,
    });
    this.setState({ cursorType: "grab" });
  };

  render() {
    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ cursor: this.state.cursorType }}
      >
        <Layer>
          {ANSWERS.map(({ id, text }, i) => (
            <Answer
              id={id}
              ref={(ref) => {
                console.log("set ref");
                this.answerRefs[id] = ref;
              }}
              text={text}
              x={(window.innerWidth / 4) * (i + 1)}
              y={20}
              isTriggered={this.state.isTouching === id}
              isActivated={this.state.isLanded === id}
            />
          ))}

          {Object.keys(this.state.traceLines).map((key) => (
            <Line
              key={key}
              id={key}
              points={this.state.traceLines[key]}
              stroke="blue"
              strokeWidth={2}
            />
          ))}

          {this.state.circles.map((circle) => (
            <Circle
              key={circle.id}
              id={circle.id}
              x={circle.x}
              y={circle.y}
              stroke="black"
              fill="#fff"
              radius={10}
              rotation={circle.rotation}
              scaleX={circle.isDragging ? 1.05 : 1}
              scaleY={circle.isDragging ? 1.05 : 1}
              draggable
              /* dragBoundFunc={() => {}} */
              onDragStart={this.handleDragStart}
              onDragMove={this.handleDragMove}
              onDragEnd={this.handleDragEnd}
              onMouseEnter={() => {
                this.setState({ cursorType: "grab" });
              }}
              onMouseLeave={() => {
                this.setState({ cursorType: "default" });
              }}
            />
          ))}
        </Layer>
      </Stage>
    );
  }
}

render(<App />, document.getElementById("root"));
