import React from "react";
import { connect } from "react-redux";
import { Stage, Layer, Circle, Line, Group } from "react-konva";
import FontFaceObserver from "fontfaceobserver";
import haveIntersection from "../helpers/haveIntersection";
import EntityQuestion from "./EntityQuestion";
import EntityAnswers from "./EntityAnswers";
import EntityStartPrompt from "./EntityStartPrompt";
import SoundMaker from "../sounds/SoundMaker";
import OrganismMaker from "../physics/OrganismsMaker";

import { isDebugMode } from "../helpers/readEnvVar.js";
import settings from "../settings";

const ENTITY_MARGIN = 0;

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

function calculateOffset() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function approximateRectAroundMouse(mouse) {
  const size = 20;
  const mousePos = {
    x: mouse.mouseupPosition.x,
    y: mouse.mouseupPosition.y,
  };
  return {
    x: mousePos.x - mouse.offset.x - size / 2,
    y: mousePos.y - mouse.offset.y - size / 2,
    height: size,
    width: size,
  };
}

class Entity extends React.Component {
  constructor(props) {
    super(props);
    const circle = generateCircle();
    this.originalCircle = circle;
    this.entityOrganismsMaker = null;
    this.state = {
      fontsLoaded: false,
      screenWidth: window.innerWidth,
      scaleFactor: 1,
      bigCircle: circle,
      organisms: [],
      traceLines: {},
      cursorType: "default",
      answersUncovered: false,
      draggedOrganismId: null,
    };
  }

  canvasElementRef = null;
  answerRefs = {};
  questionRef = null;
  startTriggerRef = null;
  entityLayerRef = null;
  timer = null;
  originalCircle = null;
  animationFrameId = null;

  componentDidMount() {
    window.addEventListener("resize", () => this.handleResize());
    this.checkFontLoading();
    this.initOrganismRendering();
    this.startAnimation();
  }

  initOrganismRendering() {
    this.entityOrganismsMaker = new OrganismMaker({
      element: this.canvasElementRef,
      circle: this.state.bigCircle,
      offset: { x: 0, y: 0 },
      onDragStart: this.handleDragStart,
      onDragEnd: this.handleDragEnd,
      onDragMove: this.handleDragMove,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.gameState !== prevProps.gameState) {
      if (this.props.gameState !== "afterendidle") {
        return;
      }
      this.timer = setTimeout(() => {
        this.clearGameState();
      }, settings.WAIT_UNTIL_GAME_RESTART);
    }
  }

  checkFontLoading() {
    new FontFaceObserver("Inconsolata").load().then(() => {
      this.setState({ fontsLoaded: true });
    });
  }

  startAnimation() {
    if (!this.animationFrameId) {
      this.animationFrameId = window.requestAnimationFrame(
        this.animateOrganisms
      );
    }
  }

  stopAnimation() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  animateOrganisms = () => {
    //talk to Organism Maker to get new coordinates
    const bodies = this.entityOrganismsMaker.getOrganisms();
    this.setState({ organisms: bodies });
    this.animationFrameId = window.requestAnimationFrame(this.animateOrganisms);
  };

  clearGameState() {
    this.setState({ traceLines: {} });
    this.props.restartGame();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleResize() {
    const newCircle = generateCircle();
    const scaleFactor = newCircle.radius / this.originalCircle.radius;
    this.setState({
      screenWidth: window.innerWidth,
      bigCircle: newCircle,
      scaleFactor: scaleFactor,
    });
  }

  handleUserAnswer(answerNumber) {
    SoundMaker.playAnswerSound(answerNumber);
    this.setState({ answersUncovered: false });
    setTimeout(this.props.goToNextQuestion, settings.WAIT_AFTER_ANSWER_SELECT);
  }

  updateDragState(isDragging) {
    this.setState({
      cursorType: isDragging ? "grabbing" : "grab",
    });
  }

  updateDragLine = (id, rawPoint) => {
    const point = {
      x: (rawPoint.x - calculateOffset().x) / this.state.scaleFactor,
      y: (rawPoint.y - calculateOffset().y) / this.state.scaleFactor,
    };
    const existingElementTraceLinePoints = this.state.traceLines[id]
      ? this.state.traceLines[id].points
      : [];
    /* append to existing trace line points for this element */
    const elementTraceLinePoints = [
      ...existingElementTraceLinePoints,
      point.x,
      point.y,
    ];
    this.setState({
      traceLines: {
        ...this.state.traceLines,
        [id]: { ...this.state.traceLines[id], points: elementTraceLinePoints },
      },
    });
  };

  /*handleDragHover = (e) => {
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
  };*/

  handleDropLandingStart = (e) => {
    if (!this.startTriggerRef) {
      return;
    }
    const mouseRect = approximateRectAroundMouse(e.mouse);
    if (haveIntersection(mouseRect, this.startTriggerRef.getClientRect())) {
      SoundMaker.playBackgroundSound();
      setTimeout(() => {
        this.props.playGame();
      }, settings.WAIT_AFTER_ANSWER_SELECT);
      this.entityOrganismsMaker.killOrganism(e.body.id);
      setTimeout(() => {
        this.entityOrganismsMaker.spawnNewOrganism();
      }, 1000);
      return;
    }
  };

  handleDropLanding = (e, body) => {
    if (!this.state.answersUncovered) return;
    const organismId = body.id;
    const mouseRect = approximateRectAroundMouse(e.mouse);
    let answerNumber = 0;
    for (let id in this.answerRefs) {
      const ref = this.answerRefs[id];
      if (!ref) return;
      if (haveIntersection(mouseRect, ref.getClientRect())) {
        this.setState({
          traceLines: {
            ...this.state.traceLines,
            [organismId]: {
              ...this.state.traceLines[organismId],
              confirmed: true,
            },
          },
        });
        this.entityOrganismsMaker.killOrganism(body.id);
        setTimeout(() => {
          this.entityOrganismsMaker.spawnNewOrganism();
        }, 1000);

        this.handleUserAnswer(answerNumber);
      }
      answerNumber++;
    }
  };

  handleDragStart = (e) => {
    SoundMaker.playPointerSound();
    const id = e.body.id;
    const point = {
      x: e.body.position.x,
      y: e.body.position.y,
    };
    this.updateDragLine(id, point);
    this.updateDragState(true);
    this.setState({ draggedOrganismId: id });
  };

  handleDragMove = (e, body) => {
    const id = body.id;
    const point = {
      x: body.position.x,
      y: body.position.y,
    };
    //this.handleDragHover(e);
    this.updateDragLine(id, point);
  };

  handleDragEnd = (e, body) => {
    SoundMaker.stopPointerSound();
    const id = e.body.id;
    const point = {
      x: e.body.position.x,
      y: e.body.position.y,
    };
    this.props.gameState === "startscreen"
      ? this.handleDropLandingStart(e)
      : this.handleDropLanding(e, body);
    this.updateDragLine(id, point);
    this.updateDragState(false);
    this.setState({ draggedOrganismId: null });
  };

  fadeAwayQuestion() {
    const ref = this.questionRef;
    if (!ref) {
      return;
    }
    ref.to({
      opacity: 0,
      duration: 0.8,
    });
  }

  uncoverAnswers() {
    this.setState({ answersUncovered: true });
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
    return (
      <>
        <canvas
          style={{ position: "absolute", zIndex: 1 }}
          ref={(node) => {
            this.canvasElementRef = node;
          }}
        ></canvas>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ cursor: this.state.cursorType }}
        >
          <Layer>
            <Group
              x={this.state.bigCircle.x}
              y={this.state.bigCircle.y}
              ref={(node) => {
                this.entityLayerRef = node;
              }}
            >
              <Circle
                x={0}
                y={0}
                radius={this.state.bigCircle.radius - 2}
                stroke={settings.ENTITY_STROKE_COLOR}
                strokeWidth={settings.ENTITY_STROKE_WIDTH}
                fill={
                  isDebugMode
                    ? settings.ENTITY_BG_COLOR_DEBUG
                    : settings.ENTITY_BG_COLOR
                }
              />

              {this.props.gameState === "playing" && this.state.fontsLoaded && (
                <EntityQuestion
                  radius={this.state.bigCircle.radius}
                  text={this.props.questionText}
                  ref={this.questionRef}
                  onAnimationHasEnded={() => this.uncoverAnswers()}
                />
              )}

              {this.props.gameState === "startscreen" &&
                this.state.fontsLoaded && (
                  <Group y={-100}>
                    <EntityStartPrompt
                      radius={this.state.bigCircle.radius}
                      createRef={(ref) => {
                        this.startTriggerRef = ref;
                      }}
                    />
                  </Group>
                )}

              {this.props.gameState === "playing" && this.state.fontsLoaded && (
                <EntityAnswers
                  options={this.props.answers}
                  radius={this.state.bigCircle.radius}
                  currentActivated={this.state.answerActivated}
                  currentTriggered={this.state.answerTriggered}
                  createRef={(answerId, ref) => {
                    this.answerRefs[answerId] = ref;
                  }}
                />
              )}

              {Object.keys(this.state.traceLines).map((key) => (
                <Line
                  scale={{
                    x: this.state.scaleFactor,
                    y: this.state.scaleFactor,
                  }}
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

              {this.props.gameState === "afterendidle" && (
                <Circle
                  x={0}
                  y={0}
                  radius={this.state.bigCircle.radius / 10}
                  stroke="black"
                  fill="black"
                />
              )}
            </Group>
          </Layer>
        </Stage>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    gameState: state.gameState,
    hasEndedWhen: state.hasEndedWhen,
    questionText: state.data[state.step].text,
    answers: state.data[state.step].answers.map((answerText, i) => ({
      id: i,
      text: answerText,
    })),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    playGame: () => dispatch({ type: "PLAY" }),
    restartGame: () => dispatch({ type: "START" }),
    goToNextQuestion: () => dispatch({ type: "NEXT" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
