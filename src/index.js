import React from "react";
import { render } from "react-dom";
import { Stage, Layer, Circle, Line, Group } from "react-konva";

import EntityQuestion from "./components/EntityQuestion";
import EntityAnswers from "./components/EntityAnswers";
import EntityOrganism from "./components/EntityOrganism";

import "./index.css";

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function generateCircle() {
  return {
    radius: window.innerHeight / 2 - 20,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function generateShapes(circle) {
  const DISTANCE = circle.radius / 6;
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: getRandomInRange(-DISTANCE, DISTANCE),
    y: getRandomInRange(-DISTANCE, DISTANCE),
    rotation: Math.random() * 180,
    isDragging: true,
  }));
}

const ANSWERS = [
  { id: "1", text: "when I was 1" },
  { id: "2", text: "when I was 2" },
  { id: "3", text: "when I was 3" },
  { id: "4", text: "when I was 5" },
];

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
    const circle = generateCircle();
    this.state = {
      bigCircle: circle,
      shapes: generateShapes(circle),
      traceLines: {},
      cursorType: "default",
      answerTriggered: null,
      answerActivated: null,
    };
  }

  answerRefs = {};

  calculateCellCenter = (e) => {
    const rect = e.target.getClientRect();
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  };

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
      point.x - this.state.bigCircle.x,
      point.y - this.state.bigCircle.y,
    ];
    this.setState({
      traceLines: { ...this.state.traceLines, [id]: elementTraceLinePoints },
    });
  };

  handleDragStart = (e) => {
    const id = e.target.id();
    this.setState({
      shapes: this.state.shapes.map((circle) => {
        return {
          ...circle,
          isDragging: circle.id === id,
        };
      }),
    });
    const center = this.calculateCellCenter(e);
    this.updateDragLine(e.target.id(), {
      x: center.x,
      y: center.y,
    });
    this.setState({ cursorType: "grabbing" });
  };

  handleDragMove = (e) => {
    /* TODO: Update position of organism in state too, to keep in sync! */
    const center = this.calculateCellCenter(e);
    this.handleDragHover(e);
    this.updateDragLine(e.target.id(), {
      x: center.x,
      y: center.y,
    });
  };

  handleDragEnd = (e) => {
    this.handleDropLanding(e);
    this.setState({
      shapes: this.state.shapes.map((circle) => {
        return {
          ...circle,
          isDragging: false,
        };
      }),
    });
    const center = this.calculateCellCenter(e);
    this.updateDragLine(e.target.id(), {
      x: center.x,
      y: center.y,
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
          <Group
            x={this.state.bigCircle.x}
            y={this.state.bigCircle.y}
            draggable
          >
            <Circle
              x={0}
              y={0}
              radius={this.state.bigCircle.radius}
              stroke="black"
              fill="#fff"
            />

            <EntityQuestion
              radius={this.state.bigCircle.radius}
              text="I'm here, like you, though I am dead and you are alive \n We both share an ability to remember. \n From when is your earliest memory?"
            />

            <EntityAnswers
              options={ANSWERS}
              radius={this.state.bigCircle.radius}
              currentActivated={this.state.answerActivated}
              currentTriggered={this.state.answerTriggered}
              createRef={(answerId, ref) => {
                this.answerRefs[answerId] = ref;
              }}
            />

            {this.state.shapes.map((o) => (
              <EntityOrganism
                key={o.id}
                id={o.id}
                x={o.x}
                y={o.y}
                rotation={o.rotation}
                isDragging={o.isDragging}
                onDragStart={this.handleDragStart}
                onDragMove={this.handleDragMove}
                onDragEnd={this.handleDragEnd}
                onMouseEnter={() => this.setState({ cursorType: "grab" })}
                onMouseLeave={() => this.setState({ cursorType: "default" })}
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
          </Group>
        </Layer>
      </Stage>
    );
  }
}

render(<App />, document.getElementById("root"));
