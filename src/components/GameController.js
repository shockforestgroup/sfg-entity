import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { count: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleIncrementClick: () => dispatch({ type: "INCREMENT" }),
    handleDecrementClick: () => dispatch({ type: "DECREMENT" }),
  };
};

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ count, handleIncrementClick, handleDecrementClick }) => {
  return (
    <div>
      <h1>State of game: {count}</h1>
      <button onClick={handleDecrementClick}>Decrement</button>
      <button onClick={handleIncrementClick}>Increment</button>
    </div>
  );
});

export default GameController;
