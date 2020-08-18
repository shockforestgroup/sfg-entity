import React from "react";
import { render } from "react-dom";
import { Stage, Layer, Circle, Line, Group } from "react-konva";

import Answer from "./components/Answer";
import AnnualRings from "./components/AnnualRings";

import "./index.css";

function generateCircle() {
  return {
    radius: window.innerHeight / 2,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
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

const ANSWERS = [
  { id: "yes", text: "Yes" },
  { id: "no", text: "No" },
  { id: "maybe", text: "Maybe" },
];

const CIRCLES = generateShapes();

function haveIntersection(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circles: CIRCLES,
      bigCircle: generateCircle(),
      traceLines: {},
      cursorType: "default",
      answerTriggered: null,
      answerActivated: null,
    };
  }

  answerRefs = {};

  handleDragHover = (e) => {
    let hoveredAnswerId = null;
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        hoveredAnswerId = id;
        break;
      }
    }
    this.setState({ answerTriggered: hoveredAnswerId });
  };

  handleDropLanding = (e) => {
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        this.setState({ answerActivated: id });
      }
    }
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
          <Group x={500} y={500}>
            <Circle
              x={0}
              y={0}
              stroke="black"
              fill="#fff"
              radius={this.state.bigCircle.radius}
            />

            <AnnualRings
              textLines={[
                "This is the first sentence This is the first sentence",
                "This is the first sentence This is the first sentence",
                "This is the first sentence This is the first sentence",
                "This is the first sentence This is the first sentence",
                "This is the first sentence This is the first sentence",
              ]}
              x={0}
              y={0}
              outerRadius={this.state.bigCircle.radius}
              ringWidth={20}
            />
          </Group>

          {ANSWERS.map(({ id, text }, i) => (
            <Answer
              key={id}
              ref={(ref) => {
                this.answerRefs[id] = ref;
              }}
              text={text}
              x={(window.innerWidth / 4) * (i + 1)}
              y={20}
              isTriggered={this.state.answerTriggered === id}
              isActivated={this.state.answerActivated === id}
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
