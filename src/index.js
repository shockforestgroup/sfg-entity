import React from "react";
import { render } from "react-dom";
import { Stage, Layer, Circle, Line, Group } from "react-konva";

import AnnualRings from "./components/AnnualRings";
import AnswerRing from "./components/AnswerRing";
import EntityOrganism from "./components/EntityOrganism";

import "./index.css";

const CELL_SHAPES = [
  "M18 19.5C18 30.2696 12.8513 39 6.50001 39C0.148731 39 0.5 30.2696 0.5 19.5C0.5 8.73045 0.148731 0 6.50001 0C12.8513 0 18 8.73045 18 19.5Z",
  "M20 26.5C20 37.2696 16.2345 39 7.88873 39C-0.456997 39 0.00457863 30.2696 0.00457863 19.5C0.00457863 8.73045 -0.456997 0 7.88873 0C16.2345 0 20 15.7304 20 26.5Z",
  "M16.9991 23.9212C16.9991 31.6801 11.4215 36 6.85798 36C-2.02875 36 0.266203 25.7589 0.266203 18C0.266203 10.2411 -0.507573 0 8.37915 0C17.2659 0 16.9991 16.1623 16.9991 23.9212Z",
];

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
    x: (Math.random() * 200) / 7 + (3 * 200) / 7,
    y: (Math.random() * 200) / 7 + (3 * 200) / 7,
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
    this.state = {
      shapes: generateShapes(),
      bigCircle: generateCircle(),
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
          <Group x={1000} y={400}>
            <Circle
              x={0}
              y={0}
              radius={this.state.bigCircle.radius}
              stroke="black"
              fill="#fff"
            />

            <AnnualRings
              textLines={[
                "I'm here, like you, though I am dead and you are alive. ",
                "We both share an ability to remember.",
                "From when is your earliest memory?",
              ]}
              x={0}
              y={0}
              outerRadius={this.state.bigCircle.radius}
              ringWidth={6}
              rotationFn={(i) => 0}
            />

            {ANSWERS.map(({ id, text }, i) => (
              <AnswerRing
                key={id}
                ref={(ref) => {
                  this.answerRefs[id] = ref;
                }}
                radius={this.state.bigCircle.radius}
                rotationOffset={-90 - (i * 180) / ANSWERS.length}
                textLines={[text]}
                isTriggered={this.state.answerTriggered === id}
                isActivated={this.state.answerActivated === id}
              />
            ))}

            {this.state.shapes.map((o, i) => (
              <>
                <EntityOrganism
                  key={o.id}
                  id={o.id}
                  x={o.x}
                  y={o.y}
                  rotation={o.rotation}
                  shapeData={CELL_SHAPES[i % CELL_SHAPES.length]}
                  isDragging={o.isDragging}
                  onDragStart={this.handleDragStart}
                  onDragMove={this.handleDragMove}
                  onDragEnd={this.handleDragEnd}
                  onMouseEnter={() => this.setState({ cursorType: "grab" })}
                  onMouseLeave={() => this.setState({ cursorType: "default" })}
                />
              </>
            ))}
          </Group>
          {Object.keys(this.state.traceLines).map((key) => (
            <Line
              key={key}
              id={key}
              points={this.state.traceLines[key]}
              stroke="blue"
              strokeWidth={2}
            />
          ))}
        </Layer>
      </Stage>
    );
  }
}

render(<App />, document.getElementById("root"));
