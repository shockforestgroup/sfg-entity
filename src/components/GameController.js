import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { gameState: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleIncrementClick: () => {
      dispatch({ type: "NEXT" });
    },
    handleDecrementClick: () => dispatch({ type: "PREVIOUS" }),
  };
};

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ handleIncrementClick, handleDecrementClick, gameState }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "300px",
      }}
    >
      <div
        style={{ border: "2px solid blue", position: "absolute", zIndex: 10 }}
      >
        <small>State of game:</small>
        <p>has started: {gameState.hasStarted ? "True" : "False"}</p>
        <p>has ended: {gameState.hasEnded ? "True" : "False"}</p>
        <p>step: {gameState.step}</p>
        <p>question: {gameState.data[gameState.step].text}</p>
        <p>
          question: {JSON.stringify(gameState.data[gameState.step].answers)}
        </p>

        <button onClick={handleDecrementClick}>Previous Question</button>
        <button onClick={handleIncrementClick}>Next Question</button>
      </div>
    </div>
  );
});

export default GameController;
