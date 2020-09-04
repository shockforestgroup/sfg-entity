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
)(({ gameState, handleIncrementClick, handleDecrementClick }) => {
  return (
    <div style={{ border: "2px solid blue" }}>
      <small>State of game: {JSON.stringify(gameState)}</small>
      <button onClick={handleDecrementClick}>Previous Question</button>
      <button onClick={handleIncrementClick}>Next Question</button>
    </div>
  );
});

export default GameController;
