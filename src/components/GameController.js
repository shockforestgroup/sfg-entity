import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { gameState: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleIncrementClick: () => dispatch({ type: "NEXT" }),
    handleDecrementClick: () => dispatch({ type: "PREVIOUS" }),
  };
};

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ handleIncrementClick, handleDecrementClick }) => {
  return (
    <div style={{ border: "2px solid blue", position: "absolute", zIndex: 10 }}>
      <small>State of game:</small>
      <button onClick={handleDecrementClick}>Previous Question</button>
      <button onClick={handleIncrementClick}>Next Question</button>
    </div>
  );
});

export default GameController;
