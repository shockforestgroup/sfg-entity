import React from "react";
import { Stage, Layer, Circle, Line, Group } from "react-konva";

import getRandomInRange from "./helpers/getRandomInRange";
import haveIntersection from "./helpers/haveIntersection";
import EntityQuestion from "./components/EntityQuestion";
import EntityAnswers from "./components/EntityAnswers";
import EntityOrganism from "./components/EntityOrganism";

import "./App.css";

function generateCircle() {
  return {
    radius: window.innerHeight / 2 - 20,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function generateOrganisms(circle) {
  const DISTANCE = circle.radius / 6;
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: getRandomInRange(-DISTANCE, DISTANCE),
    y: getRandomInRange(-DISTANCE, DISTANCE),
    rotation: Math.random() * 180,
    isDragging: false,
    isDropReady: false,
  }));
}

const ANSWERS = [
  { id: "1", text: "when I was 1" },
  { id: "2", text: "when I was 2" },
  { id: "3", text: "when I was 3" },
  { id: "4", text: "when I was 5" },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    const circle = generateCircle();
    this.state = {
      bigCircle: circle,
      organisms: generateOrganisms(circle),
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
    const organismId = e.target.id();
    let hoveredAnswerId = null;
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        hoveredAnswerId = id;
        this.setState({
          organisms: this.state.organisms.map((circle) => {
            return {
              ...circle,
              isDropReady: circle.id === organismId,
            };
          }),
        });
        break;
      }
    }
    this.setState({ answerTriggered: hoveredAnswerId });
  };

  handleDropLanding = (e) => {
    const organismId = e.target.id();
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        this.setState({
          answerActivated: id,
          traceLines: {
            ...this.state.traceLines,
            [organismId]: {
              ...this.state.traceLines[organismId],
              confirmed: true,
            },
          },
        });
      }
    }
  };

  updateDragLine = (e) => {
    const id = e.target.id();
    const center = this.calculateCellCenter(e);
    const point = { x: center.x, y: center.y };
    const existingElementTraceLinePoints = this.state.traceLines[id]
      ? this.state.traceLines[id].points
      : [];
    /* append to existing trace line points for this element */
    const elementTraceLinePoints = [
      ...existingElementTraceLinePoints,
      point.x - this.state.bigCircle.x,
      point.y - this.state.bigCircle.y,
    ];
    this.setState({
      traceLines: {
        ...this.state.traceLines,
        [id]: { ...this.state.traceLines[id], points: elementTraceLinePoints },
      },
    });
  };

  handleDragStart = (e) => {
    const id = e.target.id();
    this.updateDragLine(e);
    this.setState({
      cursorType: "grabbing",
      organisms: this.state.organisms.map((circle) => {
        return {
          ...circle,
          isDragging: circle.id === id,
        };
      }),
    });
  };

  handleDragMove = (e) => {
    /* TODO: Update position of organism in state too, to keep in sync! */
    this.handleDragHover(e);
    this.updateDragLine(e);
  };

  handleDragEnd = (e) => {
    this.handleDropLanding(e);
    this.updateDragLine(e);
    this.setState({
      cursorType: "grab",
      organisms: this.state.organisms.map((circle) => {
        return {
          ...circle,
          isDragging: false,
        };
      }),
    });
  };

  render() {
    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ cursor: this.state.cursorType }}
      >
        <Layer>
          <Group x={this.state.bigCircle.x} y={this.state.bigCircle.y}>
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

            {this.state.organisms.map((o) => (
              <EntityOrganism
                key={o.id}
                id={o.id}
                x={o.x}
                y={o.y}
                rotation={o.isDropReady ? 45 : o.rotation}
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
                points={this.state.traceLines[key].points}
                stroke={this.state.traceLines[key].confirmed && "#aaa"}
                strokeWidth={1}
                shadowColor="#333"
                shadowOffsetX={1}
                shadowBlur={50}
                opacity={1}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    );
  }
}

export default App;
