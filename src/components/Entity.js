import React from "react";
import { connect } from "react-redux";
import { Stage, Layer, Circle, Line, Group } from "react-konva";

import getRandomInRange from "../helpers/getRandomInRange";
import haveIntersection from "../helpers/haveIntersection";
import EntityQuestion from "./EntityQuestion";
import EntityAnswers from "./EntityAnswers";
import EntityOrganism from "./EntityOrganism";
import EntityStartPrompt from "./EntityStartPrompt";

import SoundMaker from "../sounds/SoundMaker";

const WAIT_AFTER_ANSWER_SELECT = 700;
const ENTITY_MARGIN = 20;

function generateCircle() {
  let dimension =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  if (dimension < 635) {
    dimension = 635;
  }
  return {
    radius: dimension / 2 - ENTITY_MARGIN,
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
  }));
}

class Entity extends React.Component {
  constructor(props) {
    super(props);
    const circle = generateCircle();
    this.state = {
      screenWidth: window.innerWidth,
      zoomFactor: 1, //0.6,
      bigCircle: circle,
      organisms: generateOrganisms(circle),
      traceLines: {},
      cursorType: "default",
      replyState: {
        answerId: null,
        organismId: null,
        confirmed: false,
      },
    };
  }

  answerRefs = {};
  startTriggerRef = null;
  entityLayerRef = null;

  componentDidMount() {
    window.addEventListener("resize", () => this.handleResize());
  }

  handleResize() {
    const circle = generateCircle();
    this.setState({ screenWidth: window.innerWidth, bigCircle: circle });
  }

  scaleEntity() {
    if (!this.entityLayerRef) return;
    this.entityLayerRef.to({
      scaleX: 1,
      scaleY: 1,
      duration: 1,
      onFinish: () => {
        this.setState({ zoomFactor: 1 });
      },
    });
  }

  calculateCellCenter = (e) => {
    const rect = e.target.getClientRect();
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  };

  updateDragState(isDragging) {
    this.setState({
      cursorType: isDragging ? "grabbing" : "grab",
    });
  }

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

  handleDragHover = (e) => {
    const organismId = e.target.id();
    let hoveredAnswerId = null;
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (!ref) return;
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        hoveredAnswerId = id;
        break;
      }
    }
    this.setState({
      replyState: {
        confirmed: false,
        answerId: hoveredAnswerId,
        organismId: organismId,
      },
    });
  };

  handleDropLandingStart = (e) => {
    if (
      haveIntersection(
        e.target.getClientRect(),
        this.startTriggerRef.getClientRect()
      )
    ) {
      SoundMaker.playBackgroundSound();
      setTimeout(() => {
        this.props.startGame();
        this.scaleEntity();
      }, WAIT_AFTER_ANSWER_SELECT);
      return;
    }
  };

  handleDropLanding = (e) => {
    if (!this.props.hasStarted) {
      this.handleDropLandingStart(e);
      return;
    }

    const organismId = e.target.id();

    let answerCount = 0;
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (!ref) return;
      if (haveIntersection(e.target.getClientRect(), ref.getClientRect())) {
        this.setState({
          traceLines: {
            ...this.state.traceLines,
            [organismId]: {
              ...this.state.traceLines[organismId],
              confirmed: true,
            },
          },

          replyState: {
            ...this.state.replyState,
            confirmed: true,
          },
        });
        SoundMaker.playAnswerSound(answerCount);
        setTimeout(() => {
          this.props.goToNextQuestion();
        }, WAIT_AFTER_ANSWER_SELECT);
      }
      answerCount++;
    }
  };

  handleDragStart = (e) => {
    SoundMaker.playPointerSound();
    const id = e.target.id();
    this.updateDragLine(e);
    this.updateDragState(true, id);
  };

  handleDragMove = (e) => {
    /* TODO: Update position of organism in state too, to keep in sync! */
    this.handleDragHover(e);
    this.updateDragLine(e);
  };

  handleDragEnd = (e) => {
    SoundMaker.stopPointerSound();
    this.handleDropLanding(e);
    this.updateDragLine(e);
    this.updateDragState(false);
  };

  uncoverAnswers() {
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (!ref) return;
      ref.to({
        opacity: 1,
        duration: 0.8,
      });
    }
  }

  render() {
    console.log("render");
    //this.scaleEntity();
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: "20px",
            width: "300px",
          }}
        >
          <p>Question: {this.props.questionText}</p>
          <p>Answers: {JSON.stringify(this.props.answers)}</p>
          <p>Has ended: {this.props.hasEnded}</p>
        </div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ cursor: this.state.cursorType }}
        >
          <Layer>
            <Group
              x={this.state.bigCircle.x}
              y={this.state.bigCircle.y}
              scale={{ x: this.state.zoomFactor, y: this.state.zoomFactor }}
              ref={(node) => {
                this.entityLayerRef = node;
              }}
            >
              <Circle
                x={0}
                y={0}
                radius={this.state.bigCircle.radius}
                stroke="black"
                fill="#fff"
              />

              {this.props.hasStarted && (
                <EntityQuestion
                  radius={this.state.bigCircle.radius}
                  text={this.props.questionText}
                  onAnimationHasEnded={() => this.uncoverAnswers()}
                />
              )}

              {this.props.hasStarted ? (
                <EntityAnswers
                  options={this.props.answers}
                  radius={this.state.bigCircle.radius}
                  currentActivated={this.state.answerActivated}
                  currentTriggered={this.state.answerTriggered}
                  createRef={(answerId, ref) => {
                    this.answerRefs[answerId] = ref;
                  }}
                />
              ) : (
                <Group
                  y={-200}
                  scale={{
                    x: 1 / this.state.zoomFactor,
                    y: 1 / this.state.zoomFactor,
                  }}
                >
                  <EntityStartPrompt
                    radius={this.state.bigCircle.radius}
                    createRef={(ref) => {
                      this.startTriggerRef = ref;
                    }}
                  />
                </Group>
              )}

              {this.state.organisms.map((o) => (
                <EntityOrganism
                  key={o.id}
                  id={o.id}
                  x={o.x}
                  y={o.y}
                  rotation={o.isDropReady ? 45 : o.rotation}
                  isDragging={o.id === this.state.draggedOrganismId}
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
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hasStarted: state.hasStarted,
    hasEnded: state.hasEnded,
    questionText: state.data[state.step].text,
    answers: state.data[state.step].answers.map((answerText, i) => ({
      id: i,
      text: answerText,
    })),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    startGame: () => dispatch({ type: "START" }),
    goToNextQuestion: () => dispatch({ type: "NEXT" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
