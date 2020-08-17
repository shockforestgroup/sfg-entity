import React from "react";
import { render } from "react-dom";
import { Stage, Layer, Text, Circle, Line } from "react-konva";

const answers = [{ text: "Yes" }, { text: "No" }, { text: "Maybe" }];

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: (Math.random() * window.innerWidth) / 7 + (3 * window.innerWidth) / 7,
    y: (Math.random() * window.innerHeight) / 7 + (3 * window.innerHeight) / 7,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = { circles: generateShapes(), traceLines: {} };

const App = () => {
  const [circles, setCircles] = React.useState(INITIAL_STATE.circles);
  const [traceLines, setTraceLines] = React.useState(INITIAL_STATE.traceLines);
  const [cursorType, setCursorType] = React.useState("default");

  const updateDragLine = (id, point) => {
    /* append to existing trace line points for this element */
    const elementTraceLinePoints = [
      ...(traceLines[id] || []),
      point.x,
      point.y,
    ];
    setTraceLines({ ...traceLines, [id]: elementTraceLinePoints });
    //console.log("event", e.evt.clientX, e.evt.clientY);
  };

  const handleDragStart = (e) => {
    const id = e.target.id();
    setCircles(
      circles.map((circle) => {
        return {
          ...circle,
          isDragging: circle.id === id,
        };
      })
    );
    updateDragLine(e.target.id(), {
      x: e.target.attrs.x,
      y: e.target.attrs.y,
    });
    setCursorType("grabbing");
  };

  const handleDragEnd = (e) => {
    setCircles(
      circles.map((circle) => {
        return {
          ...circle,
          isDragging: false,
        };
      })
    );
    updateDragLine(e.target.id(), {
      x: e.target.attrs.x,
      y: e.target.attrs.y,
    });
    setCursorType("grab");
  };

  const handleDragMove = (e) => {
    const id = e.target.id();
    updateDragLine(id, {
      x: e.target.attrs.x,
      y: e.target.attrs.y,
    });
  };

  const clearTraces = () => setTraceLines({});

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ cursor: cursorType }}
    >
      <Layer>
        <Text text="Clear traces" onClick={clearTraces} />

        <Text text={answers[0].text} x={window.innerWidth / 4} />
        <Text text={answers[1].text} x={(window.innerWidth / 4) * 2} />
        <Text text={answers[2].text} x={(window.innerWidth / 4) * 3} />
        {Object.keys(traceLines).map((key) => (
          <Line
            key={key}
            id={key}
            points={traceLines[key]}
            stroke="blue"
            strokeWidth={2}
          />
        ))}

        {circles.map((circle) => (
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
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => {
              setCursorType("grab");
            }}
            onMouseLeave={() => {
              setCursorType("default");
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

render(<App />, document.getElementById("root"));
